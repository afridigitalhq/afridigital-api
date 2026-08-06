const AfriDebugIntegrationEventContract = {

  create(input={}){

    return {

      id:`DEBUG-EVENT-${Date.now()}`,

      source:input.source || "unknown",

      type:input.type || "issue",

      payload:input.payload || {},

      receivedAt:Date.now(),

      approvalRequired:true

    };

  }

};

export default AfriDebugIntegrationEventContract;
