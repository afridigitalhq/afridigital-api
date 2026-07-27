import AfriWhatsAppMessageProcessor from "./AfriWhatsAppMessageProcessor.js";

const AfriWhatsAppRuntime = {

  receive(message){

    return AfriWhatsAppMessageProcessor.processIncoming(message);

  },

  send(response){

    return AfriWhatsAppMessageProcessor.processOutgoing(response);

  }

};

export default AfriWhatsAppRuntime;
