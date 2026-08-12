const capabilities = {};

const AfriAICapabilityEntitlementRegistry = {

  register(productId, capabilityId, definition = {}){
    if(!productId){
      throw new Error("AfriAI productId required");
    }

    if(!capabilityId){
      throw new Error("AfriAI capabilityId required");
    }

    if(!capabilities[productId]){
      capabilities[productId] = {};
    }

    capabilities[productId][capabilityId] = {
      capabilityId,
      ...definition
    };

    return capabilities[productId][capabilityId];
  },

  get(productId, capabilityId){
    return capabilities[productId]?.[capabilityId] || null;
  },

  list(productId=null){
    if(productId){
      return Object.values(
        capabilities[productId] || {}
      );
    }

    return Object.values(capabilities)
      .flatMap(
        item => Object.values(item)
      );
  }

};

export default AfriAICapabilityEntitlementRegistry;
