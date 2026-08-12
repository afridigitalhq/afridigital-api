const AfriBuildUpgradePlanner={

 plan(request={}){

  const instruction=request.instructions || "";

  const changes=[];

  if(instruction.toLowerCase().includes("login")){
   changes.push({
    type:"AUTH_FEATURE",
    target:"authentication",
    action:"ADD"
   });
  }

  if(instruction.toLowerCase().includes("dark")){
   changes.push({
    type:"UI_FEATURE",
    target:"dark_mode",
    action:"ADD"
   });
  }

  if(instruction.toLowerCase().includes("dashboard")){
   changes.push({
    type:"UI_IMPROVEMENT",
    target:"dashboard",
    action:"ENHANCE"
   });
  }

  return {
   planId:"upgrade_plan_"+Date.now(),

   upgradeId:request.upgradeId || null,

   projectId:request.projectId || null,

   fromVersion:request.currentVersion || "1.0.0",

   toVersion:request.targetVersion || "1.1.0",

   changes,

   status:"UPGRADE_PLAN_READY",

   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildUpgradePlanner;
