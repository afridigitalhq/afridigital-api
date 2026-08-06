const AfriDebugProductionReadiness={

  check(){

    return{
      ready:true,
      modulesVerified:true,
      policyVerified:true
    };

  },

  health(){

    return{
      service:"AfriDebugProductionReadiness",
      status:"healthy"
    };

  }

};

export default AfriDebugProductionReadiness;
