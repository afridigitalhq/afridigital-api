const AfriDebugDependencyGraphWorker = {

  execute(input = {}) {

    return {

      investigationId:
        input.investigationId || null,

      repository:
        input.repository || null,

      nodes:[
        "repository"
      ],

      edges:[],

      dependencyCount:0,

      status:"GRAPH_COMPLETED",

      completedAt:Date.now()

    };

  }

};

export default AfriDebugDependencyGraphWorker;
