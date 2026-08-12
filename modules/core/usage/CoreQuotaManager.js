import AfriEntitlementRegistry from "../entitlements/AfriEntitlementRegistry.js";
import AfriPayGCreditRegistry from "../payg/AfriPayGCreditRegistry.js";

const CoreQuotaManager={

 check(request={}){

  const entitlement=
   AfriEntitlementRegistry.resolve(
    request.userId,
    request.product
   );

  const limit =
   entitlement?.grants?.[request.feature] || 0;

  const used=request.used || 0;

  if(used < limit){
   return {
    allowed:true,
    source:"SUBSCRIPTION",
    limit,
    used,
    status:"QUOTA_OK"
   };
  }

  const credit=
   AfriPayGCreditRegistry.resolve(
    request.userId,
    request.product,
    request.feature
   );

  if(credit && credit.balance > 0){

   return {
    allowed:true,
    source:"PAYG",
    paygBalance:credit.balance,
    status:"PAYG_CREDIT_AVAILABLE"
   };
  }

  return {
   allowed:false,
   status:"PAYG_REQUIRED"
  };

 }

};

export default CoreQuotaManager;
