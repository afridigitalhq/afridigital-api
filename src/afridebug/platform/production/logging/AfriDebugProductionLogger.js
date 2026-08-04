const logs=[];

const AfriDebugProductionLogger={

  log(entry={}){

    logs.push({
      ...entry,
      timestamp:Date.now()
    });

  },

  stats(){

    return{
      logs:logs.length
    };

  }

};

export default AfriDebugProductionLogger;
