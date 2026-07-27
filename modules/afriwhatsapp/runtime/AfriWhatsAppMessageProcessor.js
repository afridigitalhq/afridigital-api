import AfriWhatsAppAIAdapter from "../adapters/AfriWhatsAppAIAdapter.js";

const AfriWhatsAppMessageProcessor = {

  processIncoming(message){

    return AfriWhatsAppAIAdapter.receive(message);

  },

  processOutgoing(response){

    return AfriWhatsAppAIAdapter.send(response);

  }

};

export default AfriWhatsAppMessageProcessor;
