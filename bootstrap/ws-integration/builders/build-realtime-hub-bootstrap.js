const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"realtime-hub-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapRealtimeHub(handler){
    return registerService("realtime.hub",handler);
}

module.exports={
    bootstrapRealtimeHub
};
`);

console.log("🟢 REALTIME HUB BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
