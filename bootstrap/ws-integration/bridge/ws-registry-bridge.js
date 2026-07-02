const fs = require("fs");
const path = require("path");
const registry = require("../output/ws-registry");

const OUTPUT_DIR = path.join(__dirname, "../output");

// Safe dynamic loader
function safeRequire(file) {
  try {
    return require(file);
  } catch (e) {
    return null;
  }
}

function discoverOutputs() {
  if (!fs.existsSync(OUTPUT_DIR)) return [];

  return fs
    .readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith(".js"))
    .map(f => ({
      name: f.replace(".js", ""),
      path: path.join(OUTPUT_DIR, f)
    }));
}

function syncRegistry() {
  const files = discoverOutputs();

  let count = 0;

  for (const file of files) {
    const mod = safeRequire(file.path);

    if (!mod) continue;

    const handler =
      mod.createWSGateway ||
      mod.createWSAdapter ||
      mod.bootstrapStreamBridge ||
      mod.bootstrapFlowgraph ||
      mod.bootstrapRealtimeHub ||
      mod.bootstrapAfriAI ||
      mod;

    const ok = registry.register(file.name, handler);

    if (ok) count++;
  }

  return {
    scanned: files.length,
    registered: count,
    total: registry.list().length
  };
}

module.exports = { syncRegistry };
