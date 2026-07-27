import AfriWhatsAppRuntime from "../runtime/AfriWhatsAppRuntime.js";

const AfriWhatsAppProviderGateway = {

  async receiveWebhook(payload){

    return await AfriWhatsAppRuntime.receive(
      payload
    );

  },

  sendMessage(response){

    return AfriWhatsAppRuntime.send(
      response
    );

  }

};

export default AfriWhatsAppProviderGateway;
