import AfriAIToolRegistry from "./AfriAIToolRegistry.js";

const AfriAIToolExecutor = {

  execute(tool,request){

    return {
      tool,
      request,
      availableTools:AfriAIToolRegistry.load(),
      executionOwner:"AfriDigital-api",
      status:"REQUEST_READY"
    };

  }

};

export default AfriAIToolExecutor;
