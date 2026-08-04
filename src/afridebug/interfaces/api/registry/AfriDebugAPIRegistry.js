const registry = {

  Investigation:"./investigation/AfriDebugInvestigationAPI.js",

  Marketplace:"./marketplace/AfriDebugMarketplaceAPI.js",

  Evidence:"./evidence/AfriDebugEvidenceAPI.js",

  Dashboard:"./dashboard/AfriDebugDashboardAPI.js",

  Client:"./client/AfriDebugClientAPI.js",

  Admin:"./admin/AfriDebugAdminAPI.js"

};

const AfriDebugAPIRegistry = {

  list(){

    return registry;

  },

  get(name){

    return registry[name] || null;

  },

  stats(){

    return {

      apis:Object.keys(registry).length

    };

  }

};

export default AfriDebugAPIRegistry;
