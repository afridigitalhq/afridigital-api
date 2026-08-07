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

// AfriFix Global Runtime Registration
export const AfriFixModule = { name: 'afrifix', type: 'core-runtime' };
