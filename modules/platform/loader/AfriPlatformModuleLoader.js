const AfriPlatformModuleLoader = {
  modules:[
    "afriverified",
    "afritrust",
    "afritick",
    "afridebug",
    "afridesign",
    "afridev",
  ],

  load(){
    return this.modules;
  }
};

export default AfriPlatformModuleLoader;
