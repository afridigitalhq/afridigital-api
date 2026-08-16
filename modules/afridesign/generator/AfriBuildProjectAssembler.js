const AfriBuildProjectAssembler = {

  assemble(project={}) {
    return {
      projectId:project.projectId || "project_"+Date.now(),
      userId:project.userId || "guest",
      name:project.name || "afribuild-app",
      files:project.files || {},
      status:"ASSEMBLED",
      createdAt:new Date().toISOString()
    };
  }

};

export default AfriBuildProjectAssembler;
