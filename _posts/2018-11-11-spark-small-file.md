---
layout:         post
title:          spark小文件过多问题记录
subtitle:       
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541917618267&di=3ac881e84c2b89e56117b28f7c29894a&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2Fc9e5319fcdbb1e264cfa6f4b4044cf229da230c9.jpg
date:           2018-11-11 11:00:00
tags:           bigDataDetail
post-card-type: image
---

### 1.问题描述

    1.最近使用spark sql执行etl时候出现了，最终结果大小只有几百k，但是小文件一个分区有上千的情况。
    
      危害：hdfs有最大文件数限制；
           浪费磁盘资源（可能存在空文件）。
           hive中进行统计,计算的时候,会产生很多个map,影响计算的速度。
           
           
### 2.解决流程

    1.设想：通过spark的coalesce()方法和repartition()方法
           val rdd2 = rdd1.coalesce(8, true) （true表示是否shuffle）
           val rdd3 = rdd1.repartition(8)
    
      coalesce:coalesce()方法的作用是返回指定一个新的指定分区的Rdd。
      如果是生成一个窄依赖的结果，那么可以不发生shuffle。
      分区的数量发生激烈的变化，计算节点不足，不设置true可能会出错。
      
      repartition：coalesce()方法shuffle为true的情况。
      
      但是由于使用的是同事直接写好的模块，改新增函数相对比较麻烦，所以作为后手。
      
    2.设想：降低spark并行度，即调节spark.sql.shuffle.partitions
     
      比如之前设置的为100，按理说应该生成的文件数为100；
      但是由于业务比较特殊，采用的大量的union all，且union all在spark中属于窄依赖，
      不会进行shuffle，所以导致最终会生成（union all数量+1）*100的文件数。
      如有10个union all，会生成1100个小文件。
      这样导致降低并行度为10之后，执行时长大大增加，且文件数依旧有110个，效果不理想。
       
    3.设想：新增一个并行度=1任务，专门合并小文件。
        
      于是先将原来的任务数据写到一个临时分区（如tmp）；
      再起一个类似于‘insert overwrite 目标表 select * from 临时分区’的任务（并行度为1）；
      但是结果小文件数还是没有减少，略感疑惑；
      经过多次测试及推测，原因为：‘select * from 临时分区’ 这个任务在spark中属于窄依赖；
      （spark DAG中分为宽依赖和窄依赖，只有宽依赖会进行shuffle）；
      故并行度shuffle，spark.sql.shuffle.partitions=1也就没有起到作用；
        
    4.设想（基于3）：让合并小文件的任务进行shuffle，且并行度=1
       
      由于数据量本身不大，且字段不多，所以直接采用了group by（在spark中属于宽依赖）的方式；
      类似于‘insert overwrite 目标表 select * from 临时分区 group by *’
      ‘dfs -rmr 目标表/分区=tmp’先删除了原分区及临时分区目录，以免影响测试结果
      （其实，insert overwrite是先删后增的逻辑，不会影响结果）
      先运行原任务，写到tmp分区，‘dfs -count’查看文件数，1100个；
      运行加上group by的临时任务（spark.sql.shuffle.partitions=1）；
      查看结果目录，文件数=1，成功；
      最后又加了个删除tmp分区的任务；
         
### 2.结论

    1.方便的话，可以采用coalesce()方法和repartition()方法
    
    2.如果任务逻辑简单，数据量少，可以直接降低并行度
    
    3.任务逻辑复杂，数据量很大，原任务大并行度计算写到临时分区，再加两个任务：
      一个用来将临时分区的文件用小并行度（加宽依赖）合并成少量文件到实际分区；
      另一个删除临时分区；
      
    4.hive任务减少小文件相对比较简单，可以直接设置参数，如：
    
      Map-only的任务结束时合并小文件：
      sethive.merge.mapfiles = true
      
      在Map-Reduce的任务结束时合并小文件：
      sethive.merge.mapredfiles= true
      
      当输出文件的平均大小小于1GB时，启动一个独立的map-reduce任务进行文件merge：
      sethive.merge.smallfiles.avgsize=1024000000
      
      
    
      
           
           
      
      
