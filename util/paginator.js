class Paginator {
  constructor(page) {
    this.limit = 10;
    this.count = 0;
    this.page = Number(page) || 1;
    this.list = [];
    this.evalSkip();
    return this;
  }

  //chaining methods
  setLimit(limit) {
    this.limit = Number(limit) || 10;
    this.evalSkip();
    return this;
  }
  async run(collection, query, sort = null, isAggregation = false) {
    if (isAggregation) {
      this.count = await this.runAggregationCountQuery(collection, query);
      if (this.count > 0) {
        this.list = await this.runAggregationListQuery(collection, query, sort);
      }
    } else {
      this.count = await this.runCountQuery(collection, query);
      if (this.count > 0) {
        this.list = await this.runListQuery(collection, query, sort);
      }
    }
    return this;
  }

  async runNonIndexedAggregation(
    collection,
    matchStages,
    lookupStages,
    sort = null
  ) {
    let pipeline = [],
      countPipeline = [];
    if (sort) {
      pipeline.push({ $sort: sort });
      countPipeline.push({ $sort: sort });
    }
    pipeline.push(...matchStages);
    countPipeline.push(...matchStages);
    pipeline.push(...[{ $skip: this.skip }, { $limit: this.limit }]);
    pipeline.push(...lookupStages);
    countPipeline.push(...lookupStages);
    let data = await collection
      .aggregate([
        {
          $facet: {
            list: pipeline,
            total: countPipeline.concat([{ $count: "total" }]),
          },
        },
      ])
      .allowDiskUse(true);
    this.count = data[0].total[0] ? data[0].total[0].total : 0;
    this.list = data[0].list;

    return this;
  }

  setList(list) {
    this.list = list;
  }

  //eval methods
  evalSkip() {
    this.skip = this.page == 1 ? 0 : (this.page - 1) * this.limit;
  }
  async runCountQuery(collection, query) {
    let count = await collection.countDocuments(query);
    return count;
  }
  async runAggregationCountQuery(collection, pipeline) {
    pipeline = pipeline.filter((stage) => !(stage.$skip || stage.$limit));

    let count = await collection
      .aggregate(pipeline.concat([{ $group: { _id: null, n: { $sum: 1 } } }]))
      .allowDiskUse(true);

    return count.length == 0 ? 0 : count[0].n;
  }

  async runListQuery(collection, query, sort) {
    let pipeline = [{ $match: query }];
    if (sort) {
      pipeline.push({ $sort: sort });
    }
    pipeline.push(...[{ $skip: this.skip }, { $limit: this.limit }]);
    let list = await collection.aggregate(pipeline);

    return list;
  }

  async runAggregationListQuery(collection, pipeline, sort) {
    if (sort) {
      pipeline.push({ $sort: sort });
    }
    let list = await collection
      .aggregate(
        pipeline.concat([{ $skip: this.skip }, { $limit: this.limit }])
      )
      .allowDiskUse(true);

    return list;
  }

  // o/p methods
  getCount() {
    return this.count;
  }
  getList() {
    return this.list;
  }
  build() {
    return {
      count: this.count,
      page: Number(this.page),
      total: Math.ceil(this.count / this.limit),
      limit: this.limit,
      list: this.list,
    };
  }
}

module.exports = Paginator;
