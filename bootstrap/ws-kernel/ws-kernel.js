const { syncRegistry } = require("../ws-integration/bridge/ws-registry-bridge");
const registry = require("../ws-integration/output/ws-registry");

/**
 * 🧠 WS KERNEL
 * Central orchestrator for ALL websocket systems
 */

function bootstrapWSKernel(server) {

  // 1. Sync all services into registry
  const report = syncRegistry();

  console.log("🧠 WS KERNEL INITIALIZED");
  console.log("📦 Registry Report:", report);

  // 2. Load all registered services
  const services = registry.list();

  console.log("📡 Mounting WS Services:", services.length);

  // 3. Attach services dynamically (SAFE MODE)
  services.forEach(name => {
    const handler = registry.get(name);

    try {
      if (typeof handler === "function") {
        handler(server);
        console.log(`🟢 Mounted WS Service → ${name}`);
      }
    } catch (e) {
      console.log(`🟡 Failed mounting ${name}:`, e.message);
    }
  });

  console.log("🚀 WS KERNEL READY");

  return {
    servicesMounted: services.length,
    report
  };
}

module.exports = { bootstrapWSKernel };
