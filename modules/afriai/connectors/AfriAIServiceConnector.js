import AfriAIServiceMap from "./AfriAIServiceMap.js";
import AfriPlatformRuntime from "../../platform/runtime/AfriPlatformRuntime.js";

const AfriAIServiceConnector = {

  connect(intent,payload={}){

    const service =
      AfriAIServiceMap.resolve(intent);

    const route =
      AfriPlatformRuntime.router.resolve(service);

    const gateway =
      AfriPlatformRuntime.gateway.resolve(
        String(service || "").toLowerCase()
      );

    return {
      intent,
      service,
      route,
      gateway,
      payload,
      executionOwner:"AfriDigital-api",
      status: route && gateway
        ? "SERVICE_CONNECTED"
        : "SERVICE_UNAVAILABLE"
    };

  }

};

export default AfriAIServiceConnector;
