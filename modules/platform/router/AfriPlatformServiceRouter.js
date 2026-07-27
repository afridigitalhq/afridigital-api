import AfriPlatformServiceRegistry from "../registry/AfriPlatformServiceRegistry.js";
import AfriPlatformServiceContracts from "../contracts/AfriPlatformServiceContracts.js";

const AfriPlatformServiceRouter = {
  resolve(service){
    const available = AfriPlatformServiceRegistry.services.includes(service);
    if(!available){
      return null;
    }

    return {
      service,
      contract: AfriPlatformServiceContracts[service] || null
    };
  }
};

export default AfriPlatformServiceRouter;
