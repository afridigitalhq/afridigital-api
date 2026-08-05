import AfriDevStudioProductRegistry from "../registry/AfriDevStudioProductRegistry.js";

const AfriDevStudioRuntime={
  boot(){
    return {
      name:"AfriDev Studio",
      status:"RUNNING",
      products:AfriDevStudioProductRegistry.products
    };
  }
};

export default AfriDevStudioRuntime;
