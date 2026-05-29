const fs = require("fs");
const path = require("path");

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function has(file, str) {
  try {
    return fs.readFileSync(file, "utf8").includes(str);
  } catch {
    return false;
  }
}

const checks = {
  server: exists("server.js"),
  health: has("server.js", "/health"),
  webhook: has("server.js", "/webhook"),
  orchestrator: exists("core/os/orchestratorOS.js"),
  brain: exists("core/ai/brain.js"),
  memory: exists("core/memory/store.js"),
  tools: exists("core/tools/registry/index.js"),
  tool_vm: exists("core/tools/vm/executor.js"),
  tool_policy: exists("core/tools/policy.js") || exists("core/tools/policy"),
  llm_client: exists("core/llm/client.js") || exists("core/llm/provider.js"),
  streaming: has("server.js", "stream") || exists("core/stream"),
  redis_hint:
    has("server.js", "REDIS_URL") ||
    has("core/memory/store.js", "redis") ||
    has("core/stream", "redis"),
};

const score = Object.values(checks).filter(Boolean).length;
const total = Object.keys(checks).length;

console.log("\n🧠 AFRI RENDER READINESS CHECK");
console.log("================================");
console.log(checks);
console.log("\n📊 SCORE:", score + "/" + total);

if (score === total) {
  console.log("\n🚀 READY FOR RENDER DEPLOYMENT");
  process.exit(0);
} else {
  console.log("\n⚠️ NOT READY — FIX MISSING COMPONENTS");
  process.exit(1);
}
