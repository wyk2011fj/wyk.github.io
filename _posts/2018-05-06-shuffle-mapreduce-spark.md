---
layout:         post
title:          mapResuce shuffle和spark shuffle
subtitle:       参考自https://blog.csdn.net/u010697988/article/details/70173104
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525610003200&di=7e387b19d0053abe5036e237d6781b46&imgtype=0&src=http%3A%2F%2Fpic3.16pic.com%2F00%2F54%2F82%2F16pic_5482049_b.jpg
date:           2018-05-06 18:00:00
tags:           bigData
post-card-type: image
---

Spark 和 Hadoop一直是大数据离线计算的必经之路，自己在工作中也经常用到，所以学习一下原理还是很有必要的，不然碰到问题很容易一脸懵逼，其中感觉shuffle是两者的核心之一，故整理下，方便以后回顾。

大数据的分布式计算框架目前使用的最多的就是hadoop的mapReduce和Spark，mapReducehe和Spark之间的最大区别是前者较偏向于离线处理，而后者重视实现性。

<hr>

## MapReduce的Shuffle过程介绍
从Map输出到Reduce输入的整个过程可以广义地称为Shuffle。Shuffle横跨Map端和Reduce端，在Map端包括Spill过程，在Reduce端包括copy和sort过程，如图所示：

![MacDown Screenshot](http://static.open-open.com/lib/uploadImg/20140521/20140521222449_182.jpg)

### Spill过程：

Spill过程包括collect、sort、spill、merge等步骤，如图所示：

![MacDown Screenshot](http://static.open-open.com/lib/uploadImg/20140521/20140521222449_800.jpg)

#### 1.Collect
每个Map任务不断地以对的形式把数据输出到在内存中构造的一个环形数据结构中,叫Kvbuffer,其中放置索引数据的区域叫Kvmeta。使用环形数据结构是为了更有效地使用内存空间，在内存中放置尽可能多的数据。

Kvbuffer的大小虽然可以通过参数设置，但是随着数据量的增大，还是需要把数据从内存刷到磁盘上再接着往内存写数据，把Kvbuffer中的数据刷到磁盘上的过程就叫Spill。同时，关于Spill 触发的条件（如80%时候开始spill),需要结合map写入速度与Spill速度情况而定。

Spill任务由Spill线程承担，Spill线程从Map任务接到“命令”之后就开始正式干活，干的活叫SortAndSpill。

#### 2.Sort
先把Kvbuffer中的数据按照partition值和key两个关键字升序排序，移动的只是索引数据，排序结果是Kvmeta中数据按照partition为单位聚集在一起，同一partition内的按照key有序。

#### 3.Spill
Spill线程为这次Spill过程创建一个磁盘文件：从所有的本地目录中轮训查找能存储这么大空间的目录，找到之后在其中创建一个类似于 “spill12.out”的文件。Spill线程根据排过序的Kvmeta挨个把partition的数据吐到这个文件中，直到把所有的partition遍历完。一个partition在文件中对应的数据也叫段(segment)。

有一个三元组记录某个partition对应的数据在这个文件中的索引：起始位置、原始数据长度、压缩之后的数据长度。用以记录文件中每个partition的位置。并且以同样的方式在磁盘中找一个位置，在其中创建一个类似于“spill12.out.index”的文件，文件中不光存储了索引数据，还存储了crc32的校验数据。

每一次Spill过程就会最少生成一个out文件，有时还会生成index文件，Spill的次数也包含在文件名中。索引文件和数据文件的对应关系如下图所示：

![MacDown Screenshot](http://static.open-open.com/lib/uploadImg/20140521/20140521222449_312.jpg)

Spill跟Map数据输出是同时进行的，且Map任务总要把输出的数据写到磁盘上，即使输出数据量很小在内存中全部能装得下，在最后也会把数据刷到磁盘上。

#### 4.Merge
Map任务如果输出数据量很大，可能会进行好几次Spill，out文件和Index文件会产生很多，这时候就需要进行Merge操作。

从所有的本地目录上扫描得到产生的Spill文件，得到数据和索引信息。然后创建一个叫file.out的文件和一个叫file.out.Index的文件用来存储最终的输出和索引。

#### 5.Copy
Reduce 任务通过HTTP向各个Map任务拖取它所需要的数据。内存不足时候，会先写到磁盘。同时同一节点也会走HTTP。

一般Reduce是一边copy一边sort，即copy和sort两个阶段是重叠而不是完全分开的。

<hr>

## Spark的Shuffle过程介绍
Spark丰富了任务类型，有些任务之间数据流转不需要通过Shuffle，但是有些任务之间还是需要通过Shuffle来传递数据，比如wide dependency的group by key。

### Shuffle Writer
Spark中需要Shuffle输出的Map任务会为每个Reduce创建对应的bucket，Map产生的结果会根据设置的partitioner得到对应的bucketId，然后填充到相应的bucket中去。每个Map的输出结果可能包含所有的Reduce所需要的数据，所以每个Map会创建R个bucket（R是reduce的个数），M个Map总共会创建M*R个bucket。

Map创建的bucket其实对应磁盘上的一个文件，Map的结果写到每个bucket中其实就是写到那个磁盘文件中，这个文件也被称为blockFile，这种方式一个问题就是Shuffle文件过多。

![MacDown Screenshot](http://static.open-open.com/lib/uploadImg/20140521/20140521222450_291.jpg)

针对上述Shuffle过程产生的文件过多问题，Spark有另外一种改进的Shuffle过程：consolidation Shuffle，以期显著减少Shuffle文件的数量。在consolidation Shuffle中每个bucket并非对应一个文件，而是对应文件中的一个segment部分。

比如一个Job有3个Map和2个reduce：(1)如果此时集群有3个节点有空槽，每个节点空闲了一个core，则3个Map会调度到这3个节点上执行，每个Map都会创建2个Shuffle文件，总共创建6个Shuffle文件；(2)如果此时集群有2个节点有空槽，每个节点空闲了一个core，则2个Map先调度到这2个节点上执行，每个Map都会创建2个Shuffle文件，然后其中一个节点执行完Map之后又调度执行另一个Map，则这个Map不会创建新的Shuffle文件，而是把结果输出追加到之前Map创建的Shuffle文件中；总共创建4个Shuffle文件；(3) 如果此时集群有2个节点有空槽，一个节点有2个空core一个节点有1个空core，则一个节点调度2个Map一个节点调度1个Map，调度2个Map的 节点上，一个Map创建了Shuffle文件，后面的Map还是会创建新的Shuffle文件，因为上一个Map还正在写，它创建的ShuffleFileGroup还没有释放；总共创建6个Shuffle文件。

![MacDown Screenshot](http://static.open-open.com/lib/uploadImg/20140521/20140521222450_728.jpg)

### Shuffle Fetcher
Reduce去拖Map的输出数据，Spark提供了两套不同的拉取数据框架：通过socket连接去取数据；使用netty框架去取数据。对于在本节点的Map数据，Reduce直接去磁盘上读取而不再通过网络框架。

Spark Map输出的数据没有经过排序，Spark Shuffle过来的数据也不会进行排序，Spark认为Shuffle过程中的排序不是必须的，强制地进行排序只会增加Shuffle的负担。Reduce拖过来的数据会放在一个HashMap中，HashMap中存储的也是对，key是Map输出的key，Map输出对应这个key的所有value组成HashMap的value。Spark将Shuffle取过来的每一个对插入或者更新到HashMap中，来一个处理一个。HashMap全部放在内存中。

但是当操作类似group by这样的操作时，key对应的value数据量一般很大。Spark意识到在处理数据规模远远大于内存空间时所带来的不足，引入了一个具有外部排序的方案。Shuffle过来的数据先放在内存中，当内存中存储的对超过1000并且内存使用超过70%时，判断节点上可用内存如果还足够，则把内存缓冲区大小翻倍，如果可用内存不再够了，则把内存中的对排序然后写到磁盘文件中。最后把内存缓冲区中的数据排序之后和那些磁盘文件组成一个最小堆，每次从最小堆中读取最小的数据，这个和MapReduce中的merge过程类似。
<hr />
## MapReduce和Spark的Shuffle过程对比

步骤  |  MapReduce | Spark 
------------ | ------------- | ------------
collect | 在内存中构造了一块数据结构用于map输出的缓冲  | 没有在内存中构造一块数据结构用于map输出的缓冲，而是直接把输出写到磁盘文件
sort | map输出的数据有排序  | map输出的数据没有排序
merge | 对磁盘上的多个spill文件最后进行合并成一个输出文件  | 在map端没有merge过程，在输出时直接是对应一个reduce的数据写到一个文件中，这些文件同时存在并发写，最后不需要合并成一个
copy框架 | jetty  | netty或者直接socket流
对于本节点上的文件 | 仍然是通过网络框架拖取数据  | 不通过网络框架，对于在本节点上的map输出文件，采用本地读取的方式
copy过来的数据存放位置 | 先放在内存，内存放不下时写到磁盘  | 一种方式全部放在内存；另一种方式先放在内存
merge sort | 最后会对磁盘文件和内存中的数据进行合并排序  | 对于采用另一种方式时也会有合并排序的过程

