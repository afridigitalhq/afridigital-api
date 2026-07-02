const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"flowgraph-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapFlowgraph(service){
  registerService("flowgraph",service);
  return service;
}

module.exports={ bootstrapFlowgraph };
`);

console.log("🟢 FLOWGRAPH BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
