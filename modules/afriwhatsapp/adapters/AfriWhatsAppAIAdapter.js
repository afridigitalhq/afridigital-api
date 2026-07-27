import AfriAIChannelGateway from "../../afriai/channels/AfriAIChannelGateway.js";
import AfriWhatsAppService from "../services/AfriWhatsAppService.js";

const AfriWhatsAppAIAdapter = {

  async receive(message){

    return await AfriAIChannelGateway.receive(
      "AfriWhatsApp",
      message.message
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
