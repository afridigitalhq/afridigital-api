const fs=require("fs");

const file="core/realtime/ws/stream.bridge.cjs";
let s=fs.readFileSync(file,"utf8");

if(!s.includes("bootstrapStreamBridge")){
  s='const { bootstrapStreamBridge } = require("../../../bootstrap/ws-integration/output/streambridge-bootstrap");\n'+
    s.replace(
      "module.exports = {",
      "bootstrapStreamBridge(module.exports);\n\nmodule.exports = {"
    );
  fs.writeFileSync(file,s);
}

console.log("🟢 STREAM BRIDGE INTEGRATED");
