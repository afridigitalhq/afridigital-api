import AfriWhatsAppProviderGateway from "./AfriWhatsAppProviderGateway.js";

const AfriWhatsAppWebhookHandler = {

  async handle(request){

    return await AfriWhatsAppProviderGateway.receiveWebhook(
      request
    );

  }

};

export default AfriWhatsAppWebhookHandler;
