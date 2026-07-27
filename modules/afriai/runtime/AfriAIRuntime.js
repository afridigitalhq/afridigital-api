import AfriAIServiceRegistry from "../registry/AfriAIServiceRegistry.js";

const AfriAIRuntime = {

  boot(){
    return {
      status:"READY",
      services:AfriAIServiceRegistry.load(),
      owner:"AfriDigital-api"
    };
  }

};

export default AfriAIRuntime;
