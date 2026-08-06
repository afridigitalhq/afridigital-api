import API from "../../dashboard/api/AfriDebugDashboardAPI.js";
import Registry from "../registry/AfriDebugAdminDashboardRegistry.js";

const AfriDebugControlCenterAdapter = {

  id:"afridebug",

  name:"AfriDebug",

  type:"monitoring-module",


  overview(){

    return API.getOverview();

  },


  health(){

    return {

      module:this.name,

      status:"healthy"

    };

  },


  registry(){

    return Registry.list();

  },


  report(){

    return {

      id:this.id,

      name:this.name,

      type:this.type,

      overview:this.overview(),

      registry:this.registry(),

      health:this.health()

    };

  }

};

export default AfriDebugControlCenterAdapter;
