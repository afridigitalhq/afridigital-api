import Dashboard from "../../dashboard/AfriDebugDashboardAdapter.js";

const AfriDebugDashboardAPI = {

  investigation(id){

    return Dashboard.getInvestigation(id);

  },

  stats(){

    return Dashboard.stats();

  },

  health(){

    return {

      service:"AfriDebugDashboardAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugDashboardAPI;
