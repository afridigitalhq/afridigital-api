const AfriDebugAfterSnapshot={
  capture(project){
    return {project,state:"AFTER",timestamp:new Date().toISOString()};
  }
};
export default AfriDebugAfterSnapshot;
