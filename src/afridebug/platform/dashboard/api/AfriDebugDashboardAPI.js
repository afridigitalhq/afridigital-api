const AfriDebugDashboardAPI = {

  getOverview(){

    return {

      service:"AfriDebugDashboardAPI",

      module:"AfriDebug",

      status:"operational",

      generatedAt:Date.now()

    };

  },


  health(){

    return {

      service:"AfriDebugDashboardAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugDashboardAPI;
