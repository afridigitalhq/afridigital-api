import AfriAIChannelGateway from "../../afriai/channels/AfriAIChannelGateway.js";
import AfriWhatsAppService from "../services/AfriWhatsAppService.js";

const AfriWhatsAppAIAdapter = {

  receive(message){

    return AfriAIChannelGateway.receive(
      "AfriWhatsApp",
      message
    );

  },

  async send(payload){

    return AfriWhatsAppService.send(
      payload.to,
      payload.response
    );

  }

};

export default AfriWhatsAppAIAdapter;
