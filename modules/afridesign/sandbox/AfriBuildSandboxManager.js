const AfriBuildSandboxManager={

 create(user={},project={}){

  const sandboxId =
   `sandbox_${user.id || "guest"}_${Date.now()}`;

  return {

   sandboxId,

   userId:user.id || "guest",

   projectId:
    project.id || `project_${Date.now()}`,

   isolation:true,

   permissions:{
    owner:true,
    shared:false
   },

   status:"CREATED",

   createdAt:new Date().toISOString()

  };

 }

};

export default AfriBuildSandboxManager;
