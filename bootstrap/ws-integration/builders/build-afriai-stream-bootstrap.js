const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"afriai-stream-bootstrap.js"),`
const { registerService } = require("./ws-registrar");

function bootstrapAfriAIStream(handler){
    return registerService("afriai.stream",handler);
}

module.exports={
    bootstrapAfriAIStream
};
`);

console.log("🟢 AFRIAI STREAM BOOTSTRAP BUILT");
console.log("📦 OUTPUT:",OUT);
