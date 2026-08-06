import Dashboard from "../runtime/AfriDebugDashboardRuntime.js";

const AfriDebugDashboardAPI = {

  getOverview(){

    return Dashboard.overview();

  },


  getHealth(){

    return Dashboard.health();

  },


  getMetrics(){

    return Dashboard.metrics();

  },


  getReport(){

    return Dashboard.report();

  },


  health(){

    return {

      service:"AfriDebugDashboardAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugDashboardAPI;
