const fs=require("fs");

const target="core/afriai/index.js";

let s=fs.readFileSync(target,"utf8");

if(s.includes("bootstrapAfriAI(")){
    console.log("🟡 AfriAI WS already integrated");
    process.exit(0);
}

const anchor='const attachAfriAIWebSocket = require("./ws/afriai.ws");';

const patch=`
const { bootstrapAfriAI } = require("../../bootstrap/ws-integration/output/afriai-ws-bootstrap");
bootstrapAfriAI(attachAfriAIWebSocket);
`;

if(!s.includes(anchor)){
    console.log("❌ Anchor not found:",anchor);
    process.exit(1);
}

s=s.replace(anchor,anchor+"\\n"+patch);

fs.writeFileSync(target,s);

console.log("🟢 AfriAI WS integrated into registry");
