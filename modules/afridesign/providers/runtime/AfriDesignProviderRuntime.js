import AfriDesignProviderRegistry from "../registry/AfriDesignProviderRegistry.js";

const AfriDesignProviderRuntime={

generate(request={}){

 const provider =
  AfriDesignProviderRegistry.get(
   request.provider || "mock"
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
