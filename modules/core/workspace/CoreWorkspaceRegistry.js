const CoreWorkspaceRegistry={
 register(type,workspace){
  return {type,workspace,status:"REGISTERED"};
 }
};

export default CoreWorkspaceRegistry;
