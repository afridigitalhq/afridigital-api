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
   "appdeploy"
  ]
 }

},

resolve(type="app_builder"){

 return this.builders[type] || null;

}

};

export default AfriDesignBuilderCapabilityRegistry;
