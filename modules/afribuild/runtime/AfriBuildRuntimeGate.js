import AfriFeatureAccessController from "../../core/access/AfriFeatureAccessController.js";
import CoreUsageEngine from "../../core/usage/CoreUsageEngine.js";
import CoreUsageHistory from "../../core/usage/CoreUsageHistory.js";

const AfriBuildRuntimeGate={

 execute(request={}){

  const access =
   AfriFeatureAccessController.check({
    userId:request.userId,
    product:"AfriBuild",
    feature:"APP_BUILD",
    used:request.used || 0
   });

  if(access.access==="PAYG_REQUIRED" && !access.quota.allowed){
   return {
    status:"BUILD_BLOCKED",
    reason:"NO_AVAILABLE_ACCESS"
   };
  }

  const usage =
   CoreUsageEngine.consume({
    userId:request.userId,
    product:"AfriBuild",
    resource:"APP_BUILD",
    used:request.used || 0,
    amount:1
   });

  const history =
   CoreUsageHistory.record({
    userId:request.userId,
    product:"AfriBuild",
    feature:"APP_BUILD",
    source:usage.source || "SUBSCRIPTION",
    quantity:1
   });

  return {
   buildAccess:true,
   usage,
   history,
   status:"BUILD_ALLOWED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildRuntimeGate;
