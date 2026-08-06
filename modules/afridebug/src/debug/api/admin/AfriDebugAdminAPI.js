import AdminRuntime from "../../runtime/AfriDebugAdminRuntime.js";

const AfriDebugAdminAPI = {

  runtime(){

    return AdminRuntime;

  },

  health(){

    return {

      service:"AfriDebugAdminAPI",

      status:"healthy"

    };

  }

};

export default AfriDebugAdminAPI;
