import AfriAIChannelRegistry from "./AfriAIChannelRegistry.js";
import AfriAIConversationOrchestrator from "../orchestrator/AfriAIConversationOrchestrator.js";
import AfriAIResponseComposer from "../responses/AfriAIResponseComposer.js";

const AfriAIChannelGateway = {

  async receive(channel,message){

    const result =
      await AfriAIConversationOrchestrator.process({
        sessionId: `${channel}-session`,
        message
      });

    const response =
      AfriAIResponseComposer.compose(
        result
      );

    return {
      channel,
      supportedChannels:AfriAIChannelRegistry.load(),
      runtime:"AfriAIConversationRuntime",
      conversation:result,
      response,
      status:response?.metadata?.status || "AI_RESPONSE_READY"
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
