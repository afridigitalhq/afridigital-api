const fs=require("fs");

const file="core/realtime/ws/stream.bridge.cjs";
let s=fs.readFileSync(file,"utf8");

if(s.includes("bootstrapRealtimeHub(")){
    console.log("🟡 Realtime Hub already integrated");
    process.exit(0);
}

const line='const WebSocket = require("ws");';

if(!s.includes(line)){
    console.log("❌ Anchor not found:",line);
    process.exit(1);
}

s=s.replace(
    line,
    line +
    '\nconst { bootstrapRealtimeHub } = require("../../../bootstrap/ws-integration/output/realtime-hub-bootstrap");'
);

if(s.includes("module.exports")){
    s=s.replace(
        /module\.exports\s*=\s*\{/,
        'bootstrapRealtimeHub(module.exports);\n\nmodule.exports = {'
    );
}

fs.writeFileSync(file,s);

console.log("🟢 REALTIME HUB INTEGRATED");
