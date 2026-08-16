const AfriDebugRepositoryIntakeWorker = {

  execute(input = {}) {

    const repositoryPath =
      input.path ||
      input.repositoryPath ||
      process.cwd();

    return {

      investigationId:
        input.investigationId || null,

      repository:{
        name:
          input.name ||
          input.repository?.name ||
          null,

        branch:
          input.branch ||
          input.repository?.branch ||
          "main",

        type:
          input.type ||
          input.repository?.type ||
          "local",

        url:
          input.url ||
          input.repository?.url ||
          null,

        path:repositoryPath,

        connected:true
      },

      status:"INTAKE_COMPLETED",

      completedAt:Date.now()

    };

  }

};

export default AfriDebugRepositoryIntakeWorker;
