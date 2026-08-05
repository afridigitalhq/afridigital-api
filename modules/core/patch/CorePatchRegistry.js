const CorePatchRegistry={
 register(name,config){
  return {name,config,status:"REGISTERED"};
 }
};

export default CorePatchRegistry;
