const AfriDebugProductionHealthRuntime={

  check(){

    return{
      success:true,
      status:"HEALTHY"
    };

  },

  health(){

    return{
      service:"AfriDebugProductionHealthRuntime",
      status:"healthy"
    };

  }

};

export default AfriDebugProductionHealthRuntime;
