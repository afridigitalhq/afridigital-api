const CoreRuntimeRegistry={
 register(name,runtime){
  return {name,runtime,status:"REGISTERED"};
 }
};

export default CoreRuntimeRegistry;
