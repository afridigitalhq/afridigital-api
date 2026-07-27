const AfriAIUsageMeter = {

  records: [],

  record({
    tenantId = "",
    service = "AfriAI",
    channel = "API",
    usageType = "request",
    units = 1,
    metadata = {}
  } = {}){

    const entry = {

      tenantId,
      service,
      channel,
      usageType,
      units,

      timestamp:
        new Date().toISOString(),

      metadata

    };


    this.records.push(entry);


    return {
      recorded:true,
      usage:entry
    };

  },


  getTenantUsage(tenantId){

    return this.records.filter(
      item => item.tenantId === tenantId
    );

  },


  getTotalUnits(tenantId){

    return this.getTenantUsage(tenantId)
      .reduce(
        (total,item)=> total + item.units,
        0
      );

  }

};


export default AfriAIUsageMeter;
