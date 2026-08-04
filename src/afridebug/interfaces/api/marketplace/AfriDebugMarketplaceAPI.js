import Marketplace from "../../marketplace/AfriDebugJobMarketplaceRuntime.js";

const AfriDebugMarketplaceAPI = {

  createJob(input = {}){

    return Marketplace.createJob(input);

  },

  jobs(){

    return Marketplace.listJobs
      ? Marketplace.listJobs()
      : [];

  },

  health(){

    return {
      service:"AfriDebugMarketplaceAPI",
      status:"healthy"
    };

  }

};

export default AfriDebugMarketplaceAPI;
