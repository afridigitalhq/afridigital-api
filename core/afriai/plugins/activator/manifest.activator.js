const registry = require("../manifest/manifest.registry");
const lifecycle = require("../lifecycle/plugin.lifecycle");

function activate(id){

  const manifest = registry.get(id);

  if(!manifest){
    return { ok:false, error:"NOT_FOUND", id };
  }

  lifecycle.set(id, "RUNNING");

  return {
    ok:true,
    id,
    status:"ACTIVATED"
  };
}

function deactivate(id){
  lifecycle.set(id, "STOPPED");

  return {
    ok:true,
    id,
    status:"STOPPED"
  };
}

module.exports = { activate, deactivate };
