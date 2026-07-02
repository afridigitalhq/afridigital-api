const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"streambridge-backup-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapStreamBridgeBackup(service){
  registerService("stream.bridge.backup",service);
  return service;
}

module.exports={ bootstrapStreamBridgeBackup };
`);

console.log("🟢 STREAM BRIDGE BACKUP BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
