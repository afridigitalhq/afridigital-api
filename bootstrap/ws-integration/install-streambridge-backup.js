const fs=require("fs");

const file="core/realtime/ws/stream.bridge.backup.js";
let s=fs.readFileSync(file,"utf8");

if(!s.includes("bootstrapStreamBridgeBackup")){
  s='const { bootstrapStreamBridgeBackup } = require("../../../bootstrap/ws-integration/output/streambridge-backup-bootstrap");\n'+
    s.replace(
      "module.exports = {",
      "bootstrapStreamBridgeBackup(module.exports);\n\nmodule.exports = {"
    );
  fs.writeFileSync(file,s);
}

console.log("🟢 STREAM BRIDGE BACKUP INTEGRATED");
