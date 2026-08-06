const modules = [];

const AfriDebugAdminDashboardRegistry = {

  register(module){

    modules.push(module);

    return {

      id:module.id,

      status:"registered"

    };

  },


  list(){

    return modules;

  },


  stats(){

    return {

      modules:modules.length

    };

  },


  health(){

    return {

      service:"AfriDebugAdminDashboardRegistry",

      status:"healthy"

    };

  }

};

export default AfriDebugAdminDashboardRegistry;
