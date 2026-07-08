const fs=require("fs");

[
"core/realtime/ws/stream.bridge.js",
"core/realtime/ws/hub.js"
].forEach(f=>{
  let s=fs.readFileSync(f,"utf8");

  s=s.replace(/function initWS_DISABLED/g,"function initWS");
  s=s.replace(/wss\s*=\s*null\s*\/\*\s*DISABLED_BY_WS_KERNEL\s*\*\//g,"wss = new WebSocket.Server({ server })");

  fs.writeFileSync(f,s);
  console.log("ENABLED:",f);
});

console.log("WS_KERNEL_ENABLED");
