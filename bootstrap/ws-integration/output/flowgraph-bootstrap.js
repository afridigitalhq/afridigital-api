
const { registerService } = require("./ws-registrar");

function bootstrapFlowgraph(service){
  registerService("flowgraph",service);
  return service;
}

module.exports={ bootstrapFlowgraph };
