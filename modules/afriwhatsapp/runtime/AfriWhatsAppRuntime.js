import AfriWhatsAppMessageProcessor from "./AfriWhatsAppMessageProcessor.js";

const AfriWhatsAppRuntime = {

  async receive(message){

    const aiResponse =
      await AfriWhatsAppMessageProcessor.processIncoming(
        message
      );

    const delivery =
      await AfriWhatsAppMessageProcessor.processOutgoing({
        to: message.from,
        response: aiResponse?.response?.response || aiResponse?.response || "Hello 👋 I am AfriAI."
      });

    return {
      aiResponse,
      delivery,
      status:"LIVE_TEXT_COMPLETED"
    };

  },

  async send(response){

    return await AfriWhatsAppMessageProcessor.processOutgoing(
      response
    );

  }

};

export default AfriWhatsAppRuntime;
