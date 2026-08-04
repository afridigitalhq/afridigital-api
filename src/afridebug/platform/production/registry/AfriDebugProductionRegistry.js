const modules={

  api:true,

  orchestrator:true,

  evidence:true,

  realtime:true,

  enterprise:true,

  debugIntelligence:true

};

const AfriDebugProductionRegistry={

  modules(){

    return modules;

  },

  stats(){

    return{

      modules:Object.keys(modules).length

    };

  }

};

export default AfriDebugProductionRegistry;
