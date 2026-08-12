const InternalBuilderAdapter={
 name:"internal",
 capabilities:["generate","preview"],
 async generate(request={}){
  return {
   provider:"internal",
   prompt:request.prompt || "",
   status:"READY"
  };
 }
};
export default InternalBuilderAdapter;
