import AfriAIServiceMap from "./AfriAIServiceMap.js";

const AfriAIServiceConnector = {

  connect(intent,payload){

    return {
      intent,
      service:AfriAIServiceMap.resolve(intent),
      payload,
      gateway:"PlatformGateway",
      executionOwner:"AfriDigital-api",
      status:"SERVICE_REQUEST_READY"
    };

  }

};

export default AfriAIServiceConnector;
