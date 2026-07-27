import AfriWhatsAppAIAdapter from "../adapters/AfriWhatsAppAIAdapter.js";

const AfriWhatsAppMessageProcessor = {

  async processIncoming(message){

    return AfriWhatsAppAIAdapter.receive(
      message
    );

  },

  async processOutgoing(payload){

    return AfriWhatsAppAIAdapter.send(
      payload
    );

  }

};

export default AfriWhatsAppMessageProcessor;
