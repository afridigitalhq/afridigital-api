const AfriPlatformModuleLoader = {
  modules:[
    "afriverified",
    "afritrust",
    "afritick",
    "afridebug",
    "afridev",
  ],

  load(){
    return this.modules;
  }
};

export default AfriPlatformModuleLoader;
