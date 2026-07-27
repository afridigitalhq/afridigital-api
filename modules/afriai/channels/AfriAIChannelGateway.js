import AfriAIChannelRegistry from "./AfriAIChannelRegistry.js";

const AfriAIChannelGateway = {

  receive(channel,message){

    return {
      channel,
      message,
      supportedChannels:AfriAIChannelRegistry.load(),
      runtime:"AfriAIConversationRuntime",
      status:"REQUEST_RECEIVED"
    };

  },

  respond(channel,response){

    return {
      channel,
      response,
      status:"RESPONSE_READY"
    };

  }

};

export default AfriAIChannelGateway;
