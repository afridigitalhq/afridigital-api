const AfriPlatformModuleLoader = {
  modules:[
    "afriverified",
    "afritrust",
    "afritick",
    "afridebug"
  ],

  load(){
    return this.modules;
  }
};

export default AfriPlatformModuleLoader;
