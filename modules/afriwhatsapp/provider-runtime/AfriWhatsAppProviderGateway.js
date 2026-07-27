import AfriWhatsAppRuntime from "../runtime/AfriWhatsAppRuntime.js";

const AfriWhatsAppProviderGateway = {

  receiveWebhook(payload){

    return AfriWhatsAppRuntime.receive(
      payload.message
    );

  },

  sendMessage(response){

    return AfriWhatsAppRuntime.send(
      response
    );

  }

};

export default AfriWhatsAppProviderGateway;
