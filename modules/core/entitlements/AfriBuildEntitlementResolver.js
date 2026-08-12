import AfriEntitlementRegistry from "./AfriEntitlementRegistry.js";

const AfriBuildEntitlementResolver={

 resolve(userId="guest",product="AfriBuild"){

  const entitlement=AfriEntitlementRegistry.resolve(
   userId,
   product
  );

  if(!entitlement){
   return {
    userId,
    product,
    plan:"free",
    limits:{
     builds:1
    },
    status:"DEFAULT_FREE_ENTITLEMENT",
    createdAt:new Date().toISOString()
   };
  }

  return {
   userId,
   product,
   plan:entitlement.plan,
   limits:{
    builds:entitlement.grants.APP_BUILD || 0
   },
   status:"ENTITLEMENT_RESOLVED",
   entitlementId:entitlement.entitlementId,
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildEntitlementResolver;
