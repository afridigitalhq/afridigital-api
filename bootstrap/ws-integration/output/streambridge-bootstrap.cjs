
const { registerService } = require("./ws-registrar.cjs");

function bootstrapStreamBridge(service){
  registerService("stream.bridge",service);
  return service;
}

module.exports={ bootstrapStreamBridge };
