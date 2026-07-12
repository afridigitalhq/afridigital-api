
const { registerService } = require("./ws-registrar");

function bootstrapStreamBridgeBackup(service){
  registerService("stream.bridge.backup",service);
  return service;
}

module.exports={ bootstrapStreamBridgeBackup };
