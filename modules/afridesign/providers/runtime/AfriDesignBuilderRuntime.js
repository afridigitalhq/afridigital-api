import AfriDesignBuilderCapabilityRegistry from "../capabilities/AfriDesignBuilderCapabilityRegistry.js";
import AfriDesignProviderRuntime from "./AfriDesignProviderRuntime.js";
import AfriDesignProviderRouter from "../router/AfriDesignProviderRouter.js";

const AfriDesignBuilderRuntime={

generate(request={}){

 const capability =
  AfriDesignBuilderCapabilityRegistry.resolve(
   request.type || "app_builder"
  );

 if(!capability){
  return {
   status:"FAILED",
   reason:"CAPABILITY_NOT_FOUND"
  };
 }

 const provider =
  request.provider ||
  AfriDesignProviderRouter.resolve("generate") ||
  capability.providers[0];

 return AfriDesignProviderRuntime.generate({
  ...request,
  provider
 });

}

};

export default AfriDesignBuilderRuntime;
