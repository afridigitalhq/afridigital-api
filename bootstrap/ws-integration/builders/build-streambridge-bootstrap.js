const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"streambridge-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapStreamBridge(service){
  registerService("stream.bridge",service);
  return service;
}

module.exports={ bootstrapStreamBridge };
`);

console.log("🟢 STREAM BRIDGE BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
