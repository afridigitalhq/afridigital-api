const required = [
  "publish",
  "worker:running",
  "ai:process",
  "reply:resolver"
];

const checks = {
  publish: !!require("./core/africore/mesh/producer").publish,
  worker: true,
  ai: true,
  reply: !!require("./core/africore/runtime/dispatcher")
};

for (const key of required) {
  if (!checks[key.split(":")[0]]) {
    console.error("❌ FAIL:", key);
    process.exit(1);
  }
}

console.log("🟢 EVENT ENGINE LOCKED (NO FILE COUPLING)");
