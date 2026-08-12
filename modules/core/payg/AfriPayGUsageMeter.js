const AfriPayGUsageMeter={

 record(request={}){

  return {
   usageId:"usage_"+Date.now(),
   userId:request.userId || null,
   product:request.product || "AfriBuild",
   feature:request.feature || "APP_BUILD",
   quantity:request.quantity || 1,
   unit:request.unit || "REQUEST",
   status:"USAGE_RECORDED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriPayGUsageMeter;
