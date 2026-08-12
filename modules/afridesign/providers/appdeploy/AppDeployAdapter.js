const AppDeployAdapter={
 name:"appdeploy",
 capabilities:["generate","preview"],
 async generate(request={}){
  return {
   provider:"appdeploy",
   prompt:request.prompt || "",
   status:"READY_FOR_API"
  };
 }
};
export default AppDeployAdapter;
