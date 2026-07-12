
const { registerService } = require("./ws-registrar.cjs");

function bootstrapStreamBridgeBackup(service){
  registerService("stream.bridge.backup",service);
  return service;
}

module.exports={ bootstrapStreamBridgeBackup };
