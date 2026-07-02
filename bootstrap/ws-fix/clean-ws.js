const fs = require("fs");

const file = "server.js";
let s = fs.readFileSync(file, "utf8");

console.log("🧠 CLEANING DUPLICATE WS INJECTIONS");

// remove ALL previous WS injections safely
s = s.replace(/const\s+\{\s*mountWS\s*\}\s*=\s*require\([^)]+\);\s*/g, "");
s = s.replace(/mountWS\(server,\s*kernel\);\s*/g, "");
s = s.replace(/WS_LOCK_V2_ACTIVE[\s\S]*?mountWS\(server,\s*kernel\);\s*/g, "");

// ensure kernel anchor still valid
const anchor = "mountKernelObservability(app,kernel);";

const inject = `
// WS_LOCK_V3_CLEAN
const { mountWS } = require("./bootstrap/ws-fix/mount-ws");
mountWS(server, kernel);
`;

if (!s.includes("WS_LOCK_V3_CLEAN")) {
  s = s.replace(anchor, anchor + "\n" + inject);
}

fs.writeFileSync(file, s);

console.log("🟢 WS CLEAN REBUILD COMPLETE");
