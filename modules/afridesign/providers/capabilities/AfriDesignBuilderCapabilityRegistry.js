const AfriDesignBuilderCapabilityRegistry={

builders:{
 app_builder:{
  providers:[
   "appdeploy",
   "mock"
  ],
  capabilities:[
   "generate",
   "preview",
   "export"
  ]
 },

 web_app:{
  providers:[
   "mock",
   "appdeploy"
  ]
 },

 mobile_app:{
  providers:[
   "native_android",
   "appdeploy"
  ]
 },
 native_android:{
  providers:[
   "native_android"
  ],
  capabilities:[
   "generate",
   "preview",
   "export"
  ]
 }

},

resolve(type="app_builder"){
     const normalizedType = String(type || "app_builder").replace(/-/g, "_");
     return this.builders[normalizedType] || null;
   }

};

export default AfriDesignBuilderCapabilityRegistry;
