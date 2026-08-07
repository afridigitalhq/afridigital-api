import AfriAIChannelGateway from "../../afriai/channels/AfriAIChannelGateway.js";

const AfriWebAIAdapter={

  async receive(message){
    return await AfriAIChannelGateway.receive("Web",message);
  }

};

export default AfriWebAIAdapter;
