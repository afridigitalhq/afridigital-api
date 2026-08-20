import AfriDesignBuilderCapabilityRegistry from "../capabilities/AfriDesignBuilderCapabilityRegistry.js";
import AfriDesignProviderRuntime from "./AfriDesignProviderRuntime.js";
import AfriDesignProviderRouter from "../router/AfriDesignProviderRouter.js";
import AfriBuildKnowledgeRegistry from "../../knowledge/AfriBuildKnowledgeRegistry.js";

const AfriDesignBuilderRuntime={

generate(request={}){

 const capability =
  AfriDesignBuilderCapabilityRegistry.resolve(
   request.type || request.buildType || "app_builder"
  );

 if(!capability){
  return {
   status:"FAILED",
   reason:"CAPABILITY_NOT_FOUND"
  };
 }

 const memory =
  AfriBuildKnowledgeRegistry.recall({
   type:request.buildType || "web_app"
  });

 const provider =
  request.provider ||
  AfriDesignProviderRouter.resolve(
   request.operation || "generate",
   request.type || request.buildType || null
  ) ||
  capability.providers[0];

 return AfriDesignProviderRuntime.generate({
  ...request,
  provider,
  previousBuilds:memory
 });

}

};

export default AfriDesignBuilderRuntime;
