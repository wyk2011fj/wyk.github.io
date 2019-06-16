---
layout:         post
title:          大表笛卡尔积优化思路
subtitle:       
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560708173085&di=fca32d3b338ded47a557e38a7ad68cc8&imgtype=0&src=http%3A%2F%2Fupload.idcquan.com%2F2018%2F1114%2F1542200259655.jpg
date:           2019-06-16 23:00:00
tags:           bigDataDetail
post-card-type: image
---

最近在工作过程中碰到了大表间的笛卡尔积，这个就比较恶心了，开始完全跑不出来，后来一步步优化，最终起码勉强能有结果，虽然有很多数据特殊性且思路简单，但是也还是记录下。

### 案例
假设有如下用户登录表 user_login_detail：
user代表用户，
city代表用户登录过得城市，
country代表用户国籍，
other代码其他数据；

|user| city | country |  other | 
|--|--|--|--|
| A | 上海 |中国|...|
| A | 杭州 |中国|...|
| B | 杭州 |中国|...|
| C | 北京 |美国|...|
| A | 杭州 |中国|...|

登录信息非常多，现在要得到同国籍用户下，同城用户（登录过相同城市的用户）的对应信息，如A的同城用户中，年纪最大的 ；

此时我的第一反应就是，其实逻辑很简单，自己 join 自己然后用个开窗，比如年龄字段是age，大概如下：


```
select 
	r1.user,
	max(r2.age) over(partition by country) as result_age 
from user_login_detail r1 
join user_login_detail r2 
on r1.city=r2.city
```

这时候在跑少量数据的时候是没有问题的，因为同城用户并不是很多，但是如果该表数据量非常大，且同城用户非常多，这时候就很有可能直接跑挂，开窗只是为了贴近真实场景，以中国国籍，原因分析如下：

r1表：

|user| city | 
|--|--|
| A | 上海 |
| A | 杭州 |
| B | 杭州 |
| A | 杭州 |

JOIN

r2表：

|user| city | 
|--|--|
| A | 上海 |
| A | 杭州 |
| B | 杭州 |
| A | 杭州 |

返回结果前,其中会有中间结果，类似如下：

|r1.user| city | r2.user | 
|--|--|--|
| A | 上海 |A |
| A，B，A| 杭州 |A，B，A| |

所以按照笛卡尔积结果，下一张中间表会有1*1+3*3=10条记录，当城市和用户都非常多的时候，中间结果量是很可怕的；

优化思路1：
先用group by 做一次去重和筛选的预处理，如上面的问题，可以先做如下操作：

```
select 
	user,
	city,
	max(age) as age 
from user_login_detail
group by user,city
```

假设得到的结果表为 user_login_pre ,用该表做同样的查询，即：

r1表：

|user| city | 
|--|--|
| A | 上海 |
| A | 杭州 |
| B | 杭州 |

JOIN

r2表：

|user| city | 
|--|--|
| A | 上海 |
| A | 杭州 |
| B | 杭州 |

中间表：

|r1.user| city | r2.user | 
|--|--|--|
| A | 上海 |A |
| A，B| 杭州 |A，B| |

此时产生的同样的笛卡尔积中间表的数据量为1*1+2*2=5，即中间结果直接减少了一半，在大量数据下可能就是几个T的资源节约；

优化思路2：
依旧跑不出来怎么办，在该demo下逻辑其实已经非常简单了，这时候只能采用一些别的方法，保证数据产出正常，以及资源占用量不过超标为首要任务；
先查看是否有异常数据：


```
select 
	city,
	count(distinct user) as cnt 
from user_login_detail
```

比如结果如下：

|city| cnt | 
|--|--|
|  | 9999 |
| null | 8888 |
| 上海 | 200 |
| 杭州 | 100 |

这时候很明显，有异常数据，这在实际生产中是比较有可能出现且比较容易被忽略的，这时候，再按照上面的逻辑空字符串和null就会出现9999*9998+8888*8888的中间结果，量非常大，但其实是无效的；

这里只是举例，并不一定是空字符串或者null这么简单，总而言之，需要针对非正常的数据量特别大的'city'做特殊照顾；

如果实在是正常的，就只能把正常的，且cnt特别多的先剔除，如在任务前加一个上面的distinct(user)的任务，把cnt>1000的剔除，然后发出报警，让开发知道可能存在的异常，这样可以不对资源产生影响，且让数据保持较正常的产出。

大概就是这样，其实思路也很简单，做预处理，查异常数据，再不行就剔除部分正常数据，总而言之，任务的稳定是第一位的。