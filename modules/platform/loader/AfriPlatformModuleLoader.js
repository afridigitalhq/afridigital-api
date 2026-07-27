const AfriPlatformModuleLoader = {
  modules:[
    "afriverified",
    "afritrust",
    "afritick"
  ],

  load(){
    return this.modules;
  }
};

export default AfriPlatformModuleLoader;
