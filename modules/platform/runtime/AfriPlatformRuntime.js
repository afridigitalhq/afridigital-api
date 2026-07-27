import AfriPlatformGateway from "../gateway/AfriPlatformGateway.js";
import AfriPlatformServiceRegistry from "../registry/AfriPlatformServiceRegistry.js";
import AfriPlatformServiceRouter from "../router/AfriPlatformServiceRouter.js";

const AfriPlatformRuntime = {
  gateway: AfriPlatformGateway,
  registry: AfriPlatformServiceRegistry,
  router: AfriPlatformServiceRouter,

  boot(){
    return {
      status: "READY",
      services: Object.keys(this.gateway.services)
    };
  }
};

export default AfriPlatformRuntime;
