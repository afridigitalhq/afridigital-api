const AfriPayGPriceResolver={

 resolve(request={}){

  const prices={
   APP_BUILD:1,
   APK_EXPORT:2,
   PREMIUM_ASSET:1,
   BACKEND_MODULE:5,
   VERSION_UPGRADE:2
  };

  return {
   feature:request.feature,
   price:prices[request.feature] || 0,
   currency:"USD",
   afriCoinEquivalent:null,
   status:"PRICE_RESOLVED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriPayGPriceResolver;
