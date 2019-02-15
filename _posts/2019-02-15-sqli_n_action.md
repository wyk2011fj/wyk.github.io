---
layout:         post
title:          SQL in action
subtitle:       整理SQL的日常用法
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550239888534&di=8cf0303b575be6dd7e849e9ca8edad4c&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F38dbb6fd5266d016b8f18a139c2bd40735fa3524.jpg
date:           2019-02-15 19:30:00
tags:           bigDataDetail
post-card-type: image
---

依旧还是SQL，毕竟真正工作中最常用的东西，上一篇主要说了些原理性质的东西，这篇写一些常用或者少见的HQL、Spark SQL、Oracle SQL的用法，碰到不熟的，就记录下，方便以后查阅，更新ING。

## 1.Hive SQL

##### 1. grouping sets

会把所有grouping的字段（key）都单独累计一次，组合key的话，没有的key显示null，比如：可以在求汇总行的时候用来代替 union 或者 union all。

demo:

根据pro_id,获取uv,且pro_id为'ALL'代表全部；

    --去除null
	select
	  case 
		  when r2.pro_id is not null then r2.pro_id 
		  else r2. pro_all_name 
	  end as pro_id,
	  r2.uv
	from
	  (
	    --获取带null的结果
	    select
	      r1.pro_id,
	      'ALL' as pro_all_name,
	      count(distinct r1.user_id) as uv
	    from
	      (
	        --获取基础数据
	        select
	          pro_id,
	          day,
	          user_id
	        from
	          pro_user_df
	        order by
	          day asc
	      ) r1
	    group by
	      r1.pro_id,
	      'ALL' GROUPING SETS (r1.pro_id, 'ALL')
	  ) r2


