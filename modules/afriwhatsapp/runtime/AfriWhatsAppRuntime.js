import AfriWhatsAppMessageProcessor from "./AfriWhatsAppMessageProcessor.js";

const AfriWhatsAppRuntime = {

  async receive(message){

    return await AfriWhatsAppMessageProcessor.processIncoming(
      message
    );

  },

  async send(response){

    return await AfriWhatsAppMessageProcessor.processOutgoing(
      response
    );

  }

};

export default AfriWhatsAppRuntime;
