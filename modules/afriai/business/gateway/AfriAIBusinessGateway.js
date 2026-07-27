import AfriAITenantRegistry from "../tenants/AfriAITenantRegistry.js";

const AfriAIBusinessGateway = {

  async request({
    tenantId = "",
    channel = "API",
    message = "",
    metadata = {}
  } = {}){

    const tenant =
      AfriAITenantRegistry.get(
        tenantId
      );

    if(!tenant){

      return {
        status:"TENANT_NOT_FOUND",
        message:"AfriAI business tenant unavailable"
      };

    }


    return {

      status:"BUSINESS_AI_REQUEST_READY",

      tenant:{
        id:tenant.tenantId,
        businessName:tenant.businessName,
        status:tenant.status
      },

      request:{
        channel,
        message
      },

      metadata:{
        source:"AfriAIBusinessGateway",
        version:"1.0",
        ...metadata
      }

    };

  }

};


export default AfriAIBusinessGateway;
