---
layout:         post
title:          Elasticsearch
subtitle:       Elasticsearch基本原理
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546687273694&di=6315e99afd153b5eadd0d3fc1e5eece6&imgtype=0&src=http%3A%2F%2Fwx1.sinaimg.cn%2Fcrop.0.0.2048.1150.1000%2F006qUms7gy1fccwuxi41ij31kw0w0dgv.jpg
date:           2018-08-16 19:30:00
tags:           bigDataSimple
post-card-type: image
---

### 1.Elasticsearch简介

ElasticSearch是一个基于Lucene的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful web接口。
Elasticsearch是用Java开发的，并作为Apache许可条款下的开放源码发布，是当前流行的企业级搜索引擎。设计用于云计算中，能够达到实时搜索，稳定，可靠，快速，安装使用方便。支持通过HTTP使用JSON进行数据索引。 

### 2.Lucene简介
  
    1.一种基于Java的开放源代码的全文检索引擎工具包 ，提供了完整的查询引擎和索引引擎以及部分文本分析引擎。
    2.是通过特定的倒排索引方式实现全文检索，并且Lucene提供了通用的API接口，使得用户可以方便地定制应用。    3.已经有很多Java应用程序使用Lucene作为其后台的全文索引引擎，其中，比较著名的有Eyebrows 、Jive、Eclipse、Cocoon等。
    
##### 1.Lucene索引
Lucene在扩展索引的时候不断创建新的索引文件，而不是像其它大部分搜索引擎一样维护一个索引文件，并且定期地把这些新的小索引合并到原先的大索引中。大部分的搜索引擎采用B树结构来维护索引，而索引的更新会导致大量的I/O操作。

##### 1.Lucene处理Demo

![MacDown Screenshot](/assets/images/Lucene1.png)

![MacDown Screenshot](/assets/images/Lucene2.png)


### 3.Elasticsearch存储

为了将数据添加到Elasticsearch，我们需要索引—存储关联数据的地方。
实际上，索引只是一个逻辑命名空间，它指向一个或多个分片(shards)。
在 Elasticsearch中，分片用来分配集群中的数据：把分片想象成一个数据的容器。数据被存储在分片中，然后分片又被分配在集群的节点上。当你的集群扩展或者缩小时，Elasticsearch 会自动的在节点之间迁移分配分片，以便集群保持均衡。


### 4.Elasticsearch分词

为了完成此类full-text域的搜索，ES必须首先分析文本并将其构建成为倒排索引(inverted index)。倒排索引由各文档中出现的单词列表组成，列表中的各单词不能重复且需要指向其所在的各文档。
因此，为了创建倒排索引，需要先将各文档中域的值切分为独立的单词(也称为term或token)，而后将之创建为一个无重复的有序单词列表。这个过程称之为“分词(tokenization)”。
