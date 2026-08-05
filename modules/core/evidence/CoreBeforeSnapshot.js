const CoreBeforeSnapshot={
  capture(project){
    return {project,state:"BEFORE",timestamp:new Date().toISOString()};
  }
};
export default CoreBeforeSnapshot;
