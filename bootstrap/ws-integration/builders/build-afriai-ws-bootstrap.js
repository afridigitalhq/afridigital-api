const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"afriai-ws-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapAfriAI(handler){
    return registerService("afriai.ws",handler);
}

module.exports={
    bootstrapAfriAI
};
`);

console.log("🟢 AFRIAI WS BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
