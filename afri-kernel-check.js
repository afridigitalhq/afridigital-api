const fs = require("fs");
const http = require("http");

console.log("🧠 AFRI KERNEL VALIDATION START\n");

const server = fs.readFileSync("./server.js","utf8");

const checks = {
  hasExpress: server.includes("express"),
  hasHttpServer: server.includes("http.createServer"),
  hasWebSocket: server.includes("WebSocket.Server") || server.includes("ws"),
  hasAfriAI: server.includes("afriAI") || server.includes("afriai"),
  singleListen: (server.match(/listen\(/g) || []).length === 1
};

console.log("📦 CORE STRUCTURE");
console.log(checks);

const modules = [
  "./core/whatsapp-ci/inbox",
  "./core/whatsapp-ci/pr.engine",
  "./core/event-engine/engine",
  "./core/ci/state",
  "./core/intelligence/attack.topology"
];

console.log("\n📦 MODULE LOAD TEST");

modules.forEach(m => {
  try {
    require(m);
    console.log("✔", m);
  } catch(e) {
    console.log("⚠ FAIL", m, e.message);
  }
});

http.get("http://localhost:3000/health", res => {
  let data = "";
  res.on("data", d => data += d);
  res.on("end", () => {
    console.log("\n🌐 LIVE SERVER RESPONSE");
    console.log(data);
    console.log("\n🧠 VALIDATION COMPLETE");
  });
}).on("error", e => {
  console.log("\n❌ SERVER NOT REACHABLE:", e.message);
});
