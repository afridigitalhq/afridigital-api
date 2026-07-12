const ManifestRegistry = require("./manifest.registry");

let instance = null;

function getRegistry(){
  if(!instance){
    instance = new ManifestRegistry();
  }
  return instance;
}

module.exports = getRegistry();
