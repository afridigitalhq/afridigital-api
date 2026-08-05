const CorePipelineRegistry={
 register(name,pipeline){
  return {name,pipeline,status:"REGISTERED"};
 }
};

export default CorePipelineRegistry;
