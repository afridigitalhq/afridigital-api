import AfriWhatsAppProviderGateway from "./AfriWhatsAppProviderGateway.js";

const AfriWhatsAppWebhookHandler = {

  handle(request){

    return AfriWhatsAppProviderGateway.receiveWebhook(
      request
    );

  }

};

export default AfriWhatsAppWebhookHandler;
