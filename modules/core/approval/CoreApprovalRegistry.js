const CoreApprovalRegistry={
 register(name,workflow){
  return {name,workflow,status:"REGISTERED"};
 }
};

export default CoreApprovalRegistry;
