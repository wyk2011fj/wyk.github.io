---
layout:         post
title:          各种参数调优
subtitle:       搜集各种参数，以备不时之需
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552300070161&di=1f4d81a021bdc32927d2e7c2952bc24f&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D284949801%2C1139158367%26fm%3D214%26gp%3D0.jpg
date:           2019-03-11 16:00:00
tags:           bigDataDetail
post-card-type: image
---

在实际使用Hive或者Spark的时候，肯定会涉及参数的调优，主要目的是提升资源的使用率，提升任务的性能，以最少的资源最快的完成任务的运行，有时候也是为了解决一些直接的报错，总之，不管用过没用过的都记录一下，方便以后查阅。

##Hive

    1.mapred.reduce.tasks 
    默认：1；
    所提交 Job 的 reduer 的个数，使用 Hadoop Client 的配置。
    
    2.hive.mapred.mode
    默认：'nonstrict'；
    Map/Redure 模式，如果设置为 strict，将禁止3种类型的查询：
	a.分区表的where筛选条件必须含有分区字段；
	b.对使用了order by语句的查询，必须使用limit语句
	(order by语句为执行排序会将所有的结果集数据分发到同一个reducer中进行处理，
	增加limit语句可以防止reducer额外执行很长时间)
	c.限制笛卡儿积的查询，就是有where语句，而没有on语句。 
	
	3.hive.merge.mapfiles 
	默认：true；
	在Map-only的任务结束时合并小文件。
	
	4.hive.merge.mapredfiles 
	默认：false
	是否在Map-Reduce的任务结束时合并小文件。
	
	5.hive.exec.parallel 
	默认：false
	是否开启 map/reduce job的并发提交。 
    
    
    
参考：https://www.cnblogs.com/binguo2008/p/7487782.html

