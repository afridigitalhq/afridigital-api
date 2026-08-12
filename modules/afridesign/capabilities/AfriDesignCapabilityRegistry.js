const AfriDesignCapabilityRegistry = {

 capabilities:{
  AfriBuild:{
   type:"builder",
   capabilities:[
    "app_generation",
    "app_upgrade",
    "workspace_management",
    "version_management",
    "build_certification"
   ]
  },

  AfriFix:{
   type:"debugger",
   capabilities:[
    "repository_analysis",
    "bug_detection",
    "repair_planning",
    "regression_testing",
    "fix_certification"
   ]
  }
 },

 get(product){
  return this.capabilities[product] || null;
 },

 list(){
  return Object.keys(this.capabilities);
 }

};

export default AfriDesignCapabilityRegistry;
