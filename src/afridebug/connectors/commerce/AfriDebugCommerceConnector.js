const AfriDebugCommerceConnector = {
  id:"AfriCommerce",
  name:"AfriCommerce",
  type:"commerce",

  health(){
    return {
      connector:this.name,
      status:"ready"
    };
  }
};

export default AfriDebugCommerceConnector;
