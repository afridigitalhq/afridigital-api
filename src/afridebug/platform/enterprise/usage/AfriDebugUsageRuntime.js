const usage=[];

const AfriDebugUsageRuntime={

  record(input={}){

    const metric={

      id:`USAGE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      organizationId:input.organizationId||null,

      resource:input.resource||"API",

      amount:input.amount||0,

      recordedAt:Date.now()

    };

    usage.push(metric);

    return metric;

  },

  list(){ return usage; },

  stats(){ return { usage:usage.length }; }

};

export default AfriDebugUsageRuntime;
