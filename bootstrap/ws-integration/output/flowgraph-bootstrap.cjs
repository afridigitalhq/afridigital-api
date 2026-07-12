
const { registerService } = require("./ws-registrar.cjs");

function bootstrapFlowgraph(service){
  registerService("flowgraph",service);
  return service;
}

module.exports={ bootstrapFlowgraph };
