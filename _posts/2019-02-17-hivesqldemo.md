---
layout:         post
title:          Hive SQL题集
subtitle:       整理SQL的日常用法
card-image:     https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550409746108&di=db5b5fe133b3d90f0b83f4dc0098322b&imgtype=0&src=http%3A%2F%2Fimg.25pp.com%2Fuploadfile%2Fapp%2Ficon%2F20151018%2F1445137809972635.jpg
date:           2019-02-17 18:30:00
tags:           BigDataInterview
post-card-type: image
---

仍然，仍然是SQL，这波Hive SQL要求自己一定要做到越复杂越好，越难越好，严格要求自己，才能成长，加油加油加油！

**解题思路：**

	1.看到多个key变1个，首先想到group by一手；
	2.从结果一步步往前倒推；

1.这里有5个

<https://www.cnblogs.com/qingyunzong/p/8747656.html#_labelTop>

（复杂化了，其实有几题是完全可以用窗口函数的）

2.力扣上所有中等+苦难SQL题

（上面SQL题不多，且不支持hive，不过也可以作为参考）

3.如下：

	现有如下表，记录企业每个业务（ yw_id ）的用户数 （ uv ）。
	其中每个业务都属于一个部门（ bm_id ），而每个部门下可能有多个业务。
	create table if not exists tmp_table1
	(
	    yw_id string comment '业务ID，如A1,B2,C1,D3',
	    bm_id string comment '业务所属部门id，如A,B,C,D',
	    uv bigint comment '用户数'
	)
	partitioned by (
	    dt string comment '日期分区，格式YYYYMMDD'
	)
	...
	样例数据：
	A1,A,10,20190101
	A2,A,9,20190101
	B1,B,18,20190101
	B2,B,20,20190102
	C1,C,22,20190102
	C3,C,13,20190102
	...

    a.假设现有另一张表 tmp_table2 ，如何判断两个表完全相等；
    b.求出 tmp_table1 中，至少连续 4 天 uv 列大于某个值 x 的业务（ yw_id ）和相应的区间；
    c,从 tmp_table1 某一天的分区中，随机抽样 n 条数据出来，尽量做到均匀并且高效。
    
4.如下：


