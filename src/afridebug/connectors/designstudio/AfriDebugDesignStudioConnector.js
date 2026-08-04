const AfriDebugDesignStudioConnector = {
  id:"AfriDesignStudio",
  name:"AfriDesignStudio",
  type:"design",

  health(){
    return {
      connector:this.name,
      status:"ready"
    };
  }
};

export default AfriDebugDesignStudioConnector;
