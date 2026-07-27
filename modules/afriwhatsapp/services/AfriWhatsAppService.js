import AfriWhatsAppProvider from "../providers/AfriWhatsAppProvider.js";

const AfriWhatsAppService = {

  send(to,message){

    return AfriWhatsAppProvider.sendMessage(
      to,
      message
    );

  }

};

export default AfriWhatsAppService;
