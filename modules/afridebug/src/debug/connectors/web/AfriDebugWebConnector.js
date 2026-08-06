const AfriDebugWebConnector = {
  id:"AfriWeb",
  name:"AfriWeb",
  type:"web",

  health(){
    return {
      connector:this.name,
      status:"ready"
    };
  }
};

export default AfriDebugWebConnector;
