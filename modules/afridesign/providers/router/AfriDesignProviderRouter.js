import AfriDesignProviderMarketplace from "../marketplace/AfriDesignProviderMarketplace.js";

const AfriDesignProviderRouter = {

 resolve(capability="generate"){

  const providers = AfriDesignProviderMarketplace.list();

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
