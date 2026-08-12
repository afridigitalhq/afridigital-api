import AfriEntitlementRegistry from "../entitlements/AfriEntitlementRegistry.js";
import AfriPayGCreditRegistry from "../payg/AfriPayGCreditRegistry.js";

const CoreUsageEngine={

 consume(request={}){

  const entitlement=
   AfriEntitlementRegistry.resolve(
    request.userId,
    request.product
   );

  const limit =
   entitlement?.grants?.[request.resource] || 0;

  const used=request.used || 0;

  if(used < limit){

   return {
    userId:request.userId,
    product:request.product,
    resource:request.resource,
    source:"SUBSCRIPTION",
    amount:request.amount || 1,
    status:"USAGE_RECORDED",
    timestamp:new Date().toISOString()
   };

  }


  const credit=
   AfriPayGCreditRegistry.consume({
    userId:request.userId,
    product:request.product,
    feature:request.resource,
    quantity:request.amount || 1
   });


  if(credit.status!=="INSUFFICIENT_CREDIT"){

   return {
    userId:request.userId,
    product:request.product,
    resource:request.resource,
    source:"PAYG",
    balance:credit.balance,
    status:"USAGE_RECORDED",
    timestamp:new Date().toISOString()
   };

  }


  return {
   status:"USAGE_BLOCKED",
   reason:"NO_AVAILABLE_CREDIT"
  };

 }

};

export default CoreUsageEngine;
