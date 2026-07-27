const AfriWhatsAppWebhookParser = {

  parse(payload){

    // Support direct internal test payload
    if(
      payload?.from &&
      payload?.message
    ){

      return {
        from: payload.from,
        message: payload.message,
        channel:"AfriWhatsApp"
      };

    }


    // Support Meta WhatsApp Cloud API payload
    const message =
      payload?.entry?.[0]
        ?.changes?.[0]
        ?.value
        ?.messages?.[0];


    if(!message){
      return null;
    }


    return {
      from: message.from,
      message:
        message.text?.body || "",
      channel:"AfriWhatsApp"
    };

  }

};

export default AfriWhatsAppWebhookParser;
