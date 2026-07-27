import AfriWhatsAppProviderGateway from "./AfriWhatsAppProviderGateway.js";
import AfriWhatsAppWebhookParser from "../parsers/AfriWhatsAppWebhookParser.js";

const AfriWhatsAppWebhookHandler = {

  async handle(request){

    const message =
      AfriWhatsAppWebhookParser.parse(
        request
      );


    if(!message){
      return {
        status:"IGNORED",
        reason:"No WhatsApp message payload"
      };
    }


    return await AfriWhatsAppProviderGateway.receiveWebhook(
      message
    );

  }

};

export default AfriWhatsAppWebhookHandler;
