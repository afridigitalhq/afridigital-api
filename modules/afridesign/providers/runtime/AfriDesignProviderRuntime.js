import AfriDesignProviderRegistry from "../registry/AfriDesignProviderRegistry.js";
import AfriDesignProviderRouter from "../router/AfriDesignProviderRouter.js";

const AfriDesignProviderRuntime={

generate(request={}){

 const providerName =
  request.provider ||
  AfriDesignProviderRouter.resolve(request.operation || "generate") ||
  "mock";

 const provider =
  AfriDesignProviderRegistry.get(providerName);

 if(!provider){
  return {
   status:"FAILED",
   reason:"PROVIDER_NOT_FOUND"
  };
 }

 return provider.generate(request);

},

listProviders(){

 return AfriDesignProviderRegistry.list();

}

};

export default AfriDesignProviderRuntime;
