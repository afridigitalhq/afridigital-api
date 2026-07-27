const AfriAIBusinessContract = {

  create({
    tenantId = "",
    businessName = "",
    industry = "",
    channels = [],
    services = [],
    status = "ACTIVE",
    metadata = {}
  } = {}){

    return {
      tenantId,
      businessName,
      industry,

      channels,

      services,

      status,

      capabilities:{
        aiAssistant:true,
        whatsappAgent:channels.includes("AfriWhatsApp"),
        apiAccess:channels.includes("API"),
        plugins:services.includes("Plugins")
      },

      metadata:{
        createdBy:"AfriAI",
        version:"1.0",
        ...metadata
      }

    };

  }

};

export default AfriAIBusinessContract;
