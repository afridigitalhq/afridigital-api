const CoreIdentityRegistry={
 register(type,identity){
  return {type,identity,status:"REGISTERED"};
 }
};

export default CoreIdentityRegistry;
