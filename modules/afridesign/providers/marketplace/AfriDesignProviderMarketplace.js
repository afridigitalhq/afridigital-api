import AfriDesignProviderRegistry from "../registry/AfriDesignProviderRegistry.js";

const AfriDesignProviderMarketplace = {

 list(){
  return AfriDesignProviderRegistry.list();
 },

 get(provider){
  return AfriDesignProviderRegistry.get(provider);
 },

 capabilities(provider){

  const adapter = this.get(provider);

  if(!adapter){
   return [];
  }

  return adapter.capabilities || [];

 },

 install(provider){
  return {
   provider,
   status:"AVAILABLE_FOR_REGISTRATION"
  };
 }

};

export default AfriDesignProviderMarketplace;
