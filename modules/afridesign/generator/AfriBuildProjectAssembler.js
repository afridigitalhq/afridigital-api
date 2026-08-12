const AfriBuildProjectAssembler={

 assemble(project={}){

  return {
   projectId:"project_"+Date.now(),
   name:project.name || "afribuild-app",
   files:project.files || {},
   status:"ASSEMBLED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildProjectAssembler;
