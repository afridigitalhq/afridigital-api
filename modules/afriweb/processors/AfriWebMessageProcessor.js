import AfriWebAIAdapter from "../adapters/AfriWebAIAdapter.js";

const AfriWebMessageProcessor={

  async process(message){
    return await AfriWebAIAdapter.receive(message);
  }

};

export default AfriWebMessageProcessor;
