const fs = require("fs");

const file = "server.js";
let s = fs.readFileSync(file, "utf8");

const patchMarker = "WS_LOCK_V2_ACTIVE";

// prevent duplicate injection permanently
if (s.includes(patchMarker)) {
  console.log("🟡 WS LOCK ALREADY ACTIVE");
  process.exit(0);
}

const anchor = "mountKernelObservability(app,kernel);";

const patch = `
// ${patchMarker}
const { mountWS } = require("./bootstrap/ws-fix/mount-ws");
mountWS(server, kernel);
`;

s = s.replace(anchor, anchor + "\n" + patch);

fs.writeFileSync(file, s);

console.log("🟢 WS LOCK APPLIED CLEANLY");
