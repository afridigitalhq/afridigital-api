import AfriDesignProviderRegistry from "../registry/AfriDesignProviderRegistry.js";
import AfriDesignProviderRouter from "../router/AfriDesignProviderRouter.js";

const AfriDesignProviderRuntime={

generate(request={}){

 const provider =
  AfriDesignProviderRegistry.get(
   AfriDesignProviderRouter.resolve(request.operation || "generate") || request.provider || "mock"
  );

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
