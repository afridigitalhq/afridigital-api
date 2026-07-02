const fs=require("fs");

const file="core/realtime/flowgraph-ws.js";
let s=fs.readFileSync(file,"utf8");

if(!s.includes("bootstrapFlowgraph")){
  s='const { bootstrapFlowgraph } = require("../../bootstrap/ws-integration/output/flowgraph-bootstrap");\n'+
    s.replace(
      "module.exports = {",
      "bootstrapFlowgraph(module.exports);\n\nmodule.exports = {"
    );
  fs.writeFileSync(file,s);
}

console.log("🟢 FLOWGRAPH INTEGRATED");
