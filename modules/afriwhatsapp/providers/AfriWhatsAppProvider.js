const AfriWhatsAppProvider = {

  async sendMessage(to,message){

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${process.env.META_ACCESS_TOKEN}`
        },
        body:JSON.stringify({
          messaging_product:"whatsapp",
          to,
          type:"text",
          text:{
            body:message
          }
        })
      }
    );

    const data = await response.json();

    return {
      provider:"MetaWhatsApp",
      status:response.ok ? "SENT":"FAILED",
      data
    };

  }

};

export default AfriWhatsAppProvider;
