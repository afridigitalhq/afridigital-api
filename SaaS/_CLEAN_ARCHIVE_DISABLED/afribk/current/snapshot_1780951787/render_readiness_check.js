const fs = require('fs');

console.log("🚀 RENDER READINESS CHECK");
console.log("--------------------------");

let ok = true;

function check(name, fn) {
  try {
    const res = fn();
    console.log(name, res ? "OK" : "MISSING");
    if (!res) ok = false;
  } catch (e) {
    console.log(name, "ERROR", e.message);
    ok = false;
  }
}

// 1. Server exists
check("server.js exists", () => fs.existsSync("server.js"));

// 2. Gateway files exist
check("apiGateway", () => fs.existsSync("./core/gateway/apiGateway.js"));
check("streamGateway", () => fs.existsSync("./core/gateway/streamGateway.js"));

// 3. Kernel runtime exists
check("kernel runtime", () => fs.existsSync("./core/africore/runtime/kernel.js"));

// 4. Routes wired in server
const server = fs.readFileSync("server.js", "utf8");
check("api mounted", () => server.includes("apiGateway"));
check("stream mounted", () => server.includes("streamGateway"));

// 5. Listen port
check("listen port", () => server.includes("listen"));

console.log("--------------------------");
console.log(ok ? "✅ DEPLOY READY" : "❌ NOT READY");
