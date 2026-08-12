import fs from "fs";
import AfriEntitlementRegistry from "./AfriEntitlementRegistry.js";

const publishFile="modules/core/.data/afri-product-plans-published.json";
const syncFile="modules/core/.data/afri-entitlement-sync.json";

const AfriEntitlementSyncEngine={

 sync(request={}){

  const published=JSON.parse(
   fs.readFileSync(publishFile)
  );

  const productPlan=published.find(
   x=>x.product===request.product
  );

  if(!productPlan){
   return {
    status:"PRODUCT_PLAN_NOT_FOUND"
   };
  }

  const grants=productPlan.plans[request.plan];

  if(!grants){
   return {
    status:"PLAN_TIER_NOT_FOUND"
   };
  }

  const entitlement=AfriEntitlementRegistry.register({
   userId:request.userId,
   product:request.product,
   plan:request.plan,
   grants
  });

  const result={
   syncId:"sync_"+Date.now(),
   userId:request.userId,
   product:request.product,
   plan:request.plan,
   grants,
   entitlementId:entitlement.entitlementId,
   status:"SYNC_COMPLETED",
   createdAt:new Date().toISOString()
  };

  let history=[];

  if(fs.existsSync(syncFile)){
   history=JSON.parse(
    fs.readFileSync(syncFile)
   );
  }

  history.push(result);

  fs.writeFileSync(
   syncFile,
   JSON.stringify(history,null,2)
  );

  return result;

 }

};

export default AfriEntitlementSyncEngine;
