
const registry=require("../../ws-integration/output/ws-registry");

function loadRuntime(){

  return{
    loaded:true,
    services:registry.list()
  };

}

module.exports={loadRuntime};
