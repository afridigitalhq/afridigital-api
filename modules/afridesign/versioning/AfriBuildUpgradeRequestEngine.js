const AfriBuildUpgradeRequestEngine={

 create(request={}){

  return {
   upgradeId:"upgrade_"+Date.now(),

   projectId:request.projectId || null,

   currentVersion:request.currentVersion || "1.0.0",

   targetVersion:request.targetVersion || "1.1.0",

   instructions:request.instructions || "",

   changes:[
    {
     type:"FEATURE",
     description:request.instructions || "User requested improvements"
    }
   ],

   status:"UPGRADE_REQUESTED",

   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildUpgradeRequestEngine;
