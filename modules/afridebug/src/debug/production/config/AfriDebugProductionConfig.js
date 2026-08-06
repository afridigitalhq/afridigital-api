const AfriDebugProductionConfig={

  get(){

    return{
      mode:"production",
      apiVersion:"v1",
      debug:false,
      telemetry:true,
      approvalRequired:true
    };

  },

  health(){

    return{
      service:"AfriDebugProductionConfig",
      status:"healthy"
    };

  }

};

export default AfriDebugProductionConfig;
