const AfriBuildProjectAssembler = {

  assemble(project={}) {
    return {
      projectId:project.projectId || "project_"+Date.now(),
      userId:project.userId || "guest",
      name:project.name || "afribuild-app",
      type:project.type || "web_app",
      language:project.language || null,
      generatorVersion:project.generatorVersion || null,
      packageName:project.packageName || null,
      files:project.files || {},
      status:"ASSEMBLED",
      createdAt:new Date().toISOString()
    };
  }

};

export default AfriBuildProjectAssembler;
