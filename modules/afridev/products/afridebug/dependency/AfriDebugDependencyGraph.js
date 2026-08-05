const AfriDebugDependencyGraph={
  build(repository){
    return {
      repository,
      nodes:[],
      edges:[],
      status:"DEPENDENCY_GRAPH_CREATED",
      timestamp:new Date().toISOString()
    };
  }
};

export default AfriDebugDependencyGraph;
