import AfriDesignProviderMarketplace from "../marketplace/AfriDesignProviderMarketplace.js";

const AfriDesignProviderRouter = {

 resolve(capability="generate", type=null){

  const providers = AfriDesignProviderMarketplace.list();

  if(type){
   const typedProvider = providers.find(
    item =>
     item === type &&
     AfriDesignProviderMarketplace
      .capabilities(item)
      .includes(capability)
   );

   if(typedProvider){
    return typedProvider;
   }
  }

  const provider = providers.find(
   item =>
    AfriDesignProviderMarketplace
     .capabilities(item)
     .includes(capability)
  );

  return provider || null;

 }

};

export default AfriDesignProviderRouter;
