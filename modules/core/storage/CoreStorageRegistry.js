const CoreStorageRegistry={
 register(type,adapter){
  return {type,adapter,status:"REGISTERED"};
 }
};

export default CoreStorageRegistry;
