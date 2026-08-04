const AfriDebugRepositoryIntakeWorker = {

  execute(input = {}) {

    return {

      investigationId:
        input.investigationId || null,

      repository:{
        name:
          input.name || null,

        branch:
          input.branch || "main",

        connected:true
      },

      status:"INTAKE_COMPLETED",

      completedAt:Date.now()

    };

  }

};

export default AfriDebugRepositoryIntakeWorker;
