const AfriDebugBeforeSnapshot={
  capture(project){
    return {project,state:"BEFORE",timestamp:new Date().toISOString()};
  }
};
export default AfriDebugBeforeSnapshot;
