const fs = require("fs");

const file = "server.js";
let s = fs.readFileSync(file, "utf8");

// prevent duplicate injection
if (s.includes("mountWS(server, kernel)")) {
  console.log("🟡 WS already injected");
  process.exit(0);
}

// find kernel init line
const anchor = "mountKernelObservability(app,kernel);";

const injection = `
const { mountWS } = require("./bootstrap/ws-fix/mount-ws");
mountWS(server, kernel);
`;

s = s.replace(anchor, anchor + "\n" + injection);

fs.writeFileSync(file, s);

console.log("🟢 WS V2 bootstrap injected safely");
