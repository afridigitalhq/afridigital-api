
const { registerService } = require("./ws-registrar");

function bootstrapStreamBridge(service){
  registerService("stream.bridge",service);
  return service;
}

module.exports={ bootstrapStreamBridge };
