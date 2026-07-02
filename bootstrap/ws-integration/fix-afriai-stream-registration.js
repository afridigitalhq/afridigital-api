const fs=require("fs");

const file="core/afriai/ws/afriai.stream.js";
let s=fs.readFileSync(file,"utf8");

s=s.replace(
/const \{ bootstrapAfriAIStream \} = require\([^)]+\);\s*bootstrapAfriAIStream\(module\.exports\);\s*/m,
'const { bootstrapAfriAIStream } = require("../../../bootstrap/ws-integration/output/afriai-stream-bootstrap");\n'
);

if(!s.includes("bootstrapAfriAIStream(module.exports);")){
    s += '\n\nbootstrapAfriAIStream(module.exports);\n';
}

fs.writeFileSync(file,s);

console.log("🟢 AFRIAI STREAM REGISTRATION FIXED");
