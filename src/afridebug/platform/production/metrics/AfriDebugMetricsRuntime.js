const metrics=[];

const AfriDebugMetricsRuntime={

  record(metric={}){

    metrics.push({
      ...metric,
      recordedAt:Date.now()
    });

  },

  stats(){

    return{
      metrics:metrics.length
    };

  }

};

export default AfriDebugMetricsRuntime;
