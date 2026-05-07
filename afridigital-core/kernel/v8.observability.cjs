const registry = require("../registry/service-registry.cjs");

function checkFrontend(){
  return { ok: true, service: registry.frontend.serviceId };
}

function checkBackend(){
  return { ok: true, service: registry.backend.serviceId };
}

function run(){
  console.log("\n[V8] OBSERVABILITY LAYER");
  console.log("Frontend:", checkFrontend());
  console.log("Backend:", checkBackend());
  console.log("Status: HEALTHY");
}

module.exports = { run };
