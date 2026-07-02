const fs=require("fs");

const file="core/afriai/ws/afriai.stream.js";
let s=fs.readFileSync(file,"utf8");

if(!s.includes("bootstrapAfriAIStream")){
  s='const { bootstrapAfriAIStream } = require("../../../bootstrap/ws-integration/output/afriai-stream-bootstrap");\nbootstrapAfriAIStream(module.exports);\n\n'+s;
  fs.writeFileSync(file,s);
}

console.log("🟢 AfriAI Stream integrated into registry");
