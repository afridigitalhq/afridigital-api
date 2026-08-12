import AfriBuildEntitlementResolver from "../entitlements/AfriBuildEntitlementResolver.js";
import CoreQuotaManager from "../usage/CoreQuotaManager.js";

const AfriFeatureAccessController={

 check(request={}){

  const entitlement =
   AfriBuildEntitlementResolver.resolve(
    request.userId,
    request.product
   );

  const quota =
   CoreQuotaManager.check({
    userId:request.userId,
    product:request.product,
    feature:request.feature,
    used:request.used || 0
   });


  return {
   product:request.product,
   feature:request.feature,
   entitlement,
   access:quota.allowed ? "GRANTED":"BLOCKED",
   source:quota.source || null,
   quota,
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriFeatureAccessController;
