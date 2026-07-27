import AfriAIChannelGateway from "../../afriai/channels/AfriAIChannelGateway.js";

const AfriWhatsAppAIAdapter = {

  receive(message){

    return AfriAIChannelGateway.receive(
      "AfriWhatsApp",
      message
    );

  },

  send(response){

    return {
      channel:"AfriWhatsApp",
      response,
      status:"READY_FOR_DELIVERY"
    };

  }

};

export default AfriWhatsAppAIAdapter;
