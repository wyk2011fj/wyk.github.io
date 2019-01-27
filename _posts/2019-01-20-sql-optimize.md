---
layout:         post
title:          SQL真香
subtitle:       慢更一手SQL们的故事
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547989001558&di=9de99b3910502ff78189dbcb9545ecfb&imgtype=0&src=http%3A%2F%2Fwww.onekit.cn%2Fimages%2Fsql.png
date:           2019-01-20 18:30:00
tags:           bigDataDetail
post-card-type: image
---

感觉目前大多数公司实际处理数据（主要是离线数据），基本都还是用sql的方式居多，大数据量下用hive sql、spark sql等，在关系型数据库中包括oracle、mysql等也是用sql处理逻辑，所以，积累和完善一些sql优化或者问题处理的方法和技巧还是有必要的，先init一手，后续慢慢补充。

## 1.Hive SQL

Hadoop应该是当前最流行的大数据处理工具了（没有之一的那种），单独写MapReduce任务的应该不多了，主要还是用的Hive SQL，所以如何让HQL跑的又快又稳是非常重要的。

首先，说SQL之前，可以在表的结构上做文章，比如：

1.加分区，这个应该是最常用的了，把数据分别存到各个partition，查的时候指定好分区字段或者范围，hive只会扫对应分区的数据，最简单，也最有效；

2.加桶，与加分区类似，是对表或分区的进一步划分，本人用的不多，稍稍展开下；

通过对指定列进行哈希计算来实现，通过哈希值将一个列名下的数据切分为一组桶，并使每个桶对应于该列名下的一个存储文件。

demo:

	create table bucketed_user(
	    id int,
	    name string
	)
	clustered by (id) into 4 buckets
	
作用：

    a.高效采样，数据是hash过的，从一个桶取跟从所有数据取几乎一毛一样

    b.获得更好的查询处理效率，比如，join时候知道key对应到哪个桶，就能直接取

3.转变下思路：采用增量表，或者拉链表（高大上一点叫极限存储），其实也都是很常用的方式

增量表，优点不用多说，毕竟省存储资源约等于省钱；缺点是历史信息追溯不到，但是依旧好用到飞起，毕竟很多时候过去并不重要，从关系型数据库同步的话，比较关键的是增量字段要加索引；

拉链表，弥补了增量表最大的不足，并且继承了增量表的优点，但是依旧有缺陷，频繁更新的表不适用；另外，对于表的使用者，尤其是非开发人员，存在一些理解上的弊端，这个的话，可以建视图的方式隐藏掉复杂逻辑，对外保持原来的使用模式；

以上其实都是可以单独展开写成一篇的，无奈被标题所囚禁，尊重一手写标题时候的自己，单纯的从SQL运行的角度，继续研究；

说白了，就是HQL跑的贼慢，要怎么办；

首先，类似关系型数据库，可以用 explain 查看sql执行计划，将整个执行为多个Stage；不过，自己实际用的不多，HQL执行计划异常情况也不像Oracle那样频繁，以后再完善相关内容(...)；

HQL本质上是MapReduce任务，一般map task从数据源获取数据，再经过shuffle操作到reduce端由reduce task进行操作，最终产出数据，这里各个阶段，各个步骤都是有可能拖慢整个任务的；

通过Hadoop UI界面，可以清楚的看到，各个阶段，各种task的运行状况，只要任务没有立马挂掉，就可以看到那些任务跑的快，哪些拖了个长长的尾巴，下面分别介绍下。

#### Map长尾

就是一些map任务读取并处理的数据特别多，一些map任务处理的数据特别少，造成map端长尾；

解决的思路是如何让map读取数据均匀；

原因：1.文件大小分布不均匀导致 2.MapJoin过程中，读取文件的某个值特别多（与Join长尾本质一样）

解决方式：

针对第一种情况：1.合并小文件，尽量让文件大小分布均匀 2.增加map数量

针对第二种情况：可以采用 distribute by rand() , 会将map端分发后的数据重新按照随机值再进行一次分发。

展开：

    1.Map数量不是单纯由用户设置的，是由InputFormat接口的getSplits方法决定；  
    每个map处理一个fileSplit，即 map数=fileSplit数；
      
    逻辑为：
    
    （源码贴了会看？直接上干货!）
    
    分片大小：splitSize = max (minSize, min(goalSize, dfs.block.size))
    
    其中：
    
    goalSize = totalSize / mapred.map.tasks
    minSize = max {mapred.min.split.size, minSplitSize}
    
    totalSize：一个JOB的所有map总的输入大小
    mapred.map.tasks：默认2，期望map数
    minSplitSize：默认为1，可复写（特殊情况）
    dfs.block.size：1.X默认64M，2.X默认128M
    
    Map数量：
    文件大小/splitSize>1.1，创建一个split，即一个map task；
    文件剩余大小/splitSize<1.1，剩余的部分作为一个split；
    
    结论：
    通过调节 mapred.map.tasks（期望map数）和 mapred.min.split.size（最小文件分割大小）
    可实际实现 map数量 的控制；
    
    实际应用：
    想增加map个数，设置 mapred.map.tasks 为一个较大的值，如map长尾问题；
    想减小map个数，设置 mapred.min.split.size 为一个较大的值，如小文件过多；
    
    2.Hive小文件合并（设置参数即可）
    
    map-only的任务结束时合并小文件：
    sethive.merge.mapfiles = true
  
    在Map-Reduce的任务结束时合并小文件：
    sethive.merge.mapredfiles= true
  
    当输出文件的平均大小小于1GB时，启动一个独立的map-reduce任务进行文件merge：
    sethive.merge.smallfiles.avgsize=1024000000

    3.Spark小文件合并
    
    之前写过干货：https://wyk2011fj.github.io/2018/11/spark-small-file/
    
    4.distribute by、sort by
    
    distribute by a 表面map端的结果会按照a字段分发到reduce(默认为hash)；
    sort by 在每个reducer端都会做排序，最后做归并排序（order by只用一个reduce总排序）；
    
    
#### Join长尾

SQL在Join执行阶段会将Join Key相同的数据分发到同一个执行Instance上处理。如果某个Key上的数据量比较多，会导致该Instance执行时间比其他Instance执行时间长；

1.小表长尾

当某路输入比较小，可以采用Mapjoin避免倾斜。原理是将Join操作提前到Map端执行，这样可以避免因为分发Key不均匀导致数据倾斜。

Mapjoin的使用有限制，必须是Join中的从表比较小才可用。所谓从表，即Left Outer Join中的右表，或者Right Outer Join中的左表。

展开：

    1.Common join
    
    Map阶段
    读取源表的数据，Map输出时候以Join on条件中的列为key；
    Map输出的value(含所属表信息)为join之后所关心的(select或者where中需要用到的)列；
    按照key进行排序；

    Shuffle阶段
    根据key的值进行hash,并将key/value按照hash值推送至不同的reduce中；
    （每个map都可能有所有的key）        

    Reduce阶段
    根据key的值完成join操作。
    
    2.MapJoin
    
    原理：
    把小表全部读入内存中，在map阶段直接拿另外一个表的数据和内存中表数据做匹配，即完成join操作；
    
    相关设置：
    小表自动选择Mapjoin: hive.auto.convert.join=true
    小表阈值:hive.mapjoin.smalltable.filesize (默认25M)
    (下面两个不常用)
    mapjoin做group by时可以使用的最大内存占比：
    hive.mapjoin.followby.gby.localtask.max.memory.usage （默认0.55）
    本地mapjoin可以使用内存占比：hive.mapjoin.localtask.max.memory.usage （默认0.9）
    
2.空值长尾

join时，当左表(left_table)存在大量的空值，空值聚集到一个reduce上。且从表为大表，无法使用mapjoin 。

可以使用 coalesce(left_table.key, rand()*9999)将key为空的情况下赋予随机值，来避免空值集中造成长尾。

展开：

    1.hive coalesce函数
    
    非空查找函数；
    
    COALESCE(T v1, T v2,…)，返回参数中的第一个非空值；如果所有值都为NULL，那么返回NULL；
    
    demo:COALESCE(null,100,50)=100,COALESCE(null,null,50)=50
    
3.热点值长尾

感觉这个应该才是最常见和典型的，压轴了；

好吧，其实处理原理是最简单的，就是把热点数据捞出来，分别处理；

demo:

取热点PV商品,PV>10000：

	insert table hot_products_tmp
	select
	      distinct p_id
	from
	    (
	        select
	            p_id,
	            count(1) as pv
	        from log
	        group by p_id
	    ) a
	where pv >= 10000

取非热点（剔除热点表hot_products_tmp表中商品）商品PV：

	select /*+mapjoin(b)*/ a.p_id,a.pv
	from (
	    select p_id
	        ,  count(1) as pv
	    from log
	) a
	left outer join (
	    select p_id
	    from hot_products_tmp
	) b
	on a.p_id = b.p_id	    
	and b.p_id is null
	
取热点商品PV：

	select /*+mapjoin(d)*/ c.p_id,c.pv
	from (
	    select p_id
	        ,  count(1) as pv
	    from log
	) c
	join (
	    select p_id
	    from hot_products_tmp
	) d
	on c.p_id = d.p_id
    
最后 union all 一手即可。

#### Reduce长尾

reduce端产生长尾的主要原因是key分布不均匀，导致有些reduce的Instance处理的数据明显偏多；

一般出现在distinct操作中，数据无法在Map端的Shuffle阶段根据Group By先做一次聚合操作（combiner操作）,减少传输的数据量，而是将所有的数据都传输到Reduce端，当Key的数据分发不均匀时，就会导致Reduce端长尾；

当多个Distinct同时出现在一段SQL代码中时，数据会被分发多次，不仅会造成数据膨胀N倍，也会把长尾现象放大N倍。

Shuffle操作，之前水过一篇，还是很详细的：
<https://wyk2011fj.github.io/2018/05/shuffle-mapreduce-spark/>

解决思路：

用其他写法，代替distinct操作，或者count(disitnct)操作；

demo:

原SQL：

	select d1
	    ,  d2
	    ,  count(distinct case 
	       when a is not null then b
	       end) as b_distinct_cnt
	from xxx
	group by d1,d2
	
优化SQL：

先将中间结果写进临时表：

	create table tmp1
	as
	select d1,d2,b,
	count( case when a is not null then b end ) as b_cnt
	from xxx
	group by d1, d1, b
	
再从临时表获取结果数据：

	select d1,d2,
	sum(case when b_cnt > 0 then 1 else 0 end) as b_distinct_cnt
	from tmp1
	group by d1,d2

当有多个distinct时，道理也一样，拆成多张tmp表；

## 2.Oracle SQL

Oracle不用多说了，大大小小公司，反正不是Oracle就是MySql，别的应该不是很多（犹记得实验室时候用的PG），关系型数据库，道理基本差不多；

一般直接面向服务，故SQL性能就直接影响服务体验了，程序员必备技能，有备无患；

最重要的，肯定首先是 分区 and 索引 ，这两个是优先考虑的，别的，等有空再完善起来；

(...)


参考：
https://www.cnblogs.com/duanxingxing/p/6874318.html
https://www.cnblogs.com/qinwangchen/p/5837940.html
https://www.cnblogs.com/1130136248wlxk/articles/5294955.html
https://www.cnblogs.com/qiuhong10/p/7698277.html
https://blog.csdn.net/kwu_ganymede/article/details/51365002
https://blog.csdn.net/jthink_/article/details/38903775
https://www.cnblogs.com/zlslch/p/6105143.html
https://blog.csdn.net/longshenlmj/article/details/51569892
《大数据之路-阿里巴巴大数据实践》
