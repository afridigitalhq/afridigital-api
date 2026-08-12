import AfriDesignCapabilityRegistry from "./AfriDesignCapabilityRegistry.js";

const AfriDesignCapabilityRouter = {

 resolve(request={}){

  const product = request.product;

  const capability =
   AfriDesignCapabilityRegistry.get(product);

  if(!capability){
   return null;
  }

  return {
   product,
   type:capability.type,
   capabilities:capability.capabilities,
   status:"AVAILABLE"
  };

 }

};

export default AfriDesignCapabilityRouter;
