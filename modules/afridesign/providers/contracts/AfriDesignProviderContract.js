const AfriDesignProviderContract={
 name:"provider",
 capabilities:["generate","preview","export"],
 generate(){
  throw new Error("Provider generate not implemented");
 },
 preview(){
  throw new Error("Provider preview not implemented");
 },
 export(){
  throw new Error("Provider export not implemented");
 }
};
export default AfriDesignProviderContract;
