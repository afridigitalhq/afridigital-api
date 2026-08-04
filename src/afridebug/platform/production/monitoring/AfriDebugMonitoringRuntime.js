const AfriDebugMonitoringRuntime={

  status(){

    return{
      monitoredServices:0,
      monitoring:true
    };

  },

  health(){

    return{
      service:"AfriDebugMonitoringRuntime",
      status:"healthy"
    };

  }

};

export default AfriDebugMonitoringRuntime;
