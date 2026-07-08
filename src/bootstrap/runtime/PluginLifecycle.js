export class PluginLifecycle {
  constructor() {
    this.plugins = new Map();
  }

  register(name, plugin) {
    this.plugins.set(name, {
      instance: plugin,
      status: "registered",
      healthy: true
    });
  }

  startAll(server) {
    console.log("⚙️ Starting Plugin Lifecycle...");

    for (const [name, p] of this.plugins) {
      try {
        if (typeof p.instance.onStart === "function") {
          p.instance.onStart(server);
        }
        p.status = "running";
        console.log("✅ Started plugin:", name);
      } catch (e) {
        p.status = "failed";
        p.healthy = false;
        console.log("❌ Plugin failed:", name, e.message);
      }
    }

    console.log("🚀 All plugins lifecycle started");
  }

  broadcast(event) {
    for (const [name, p] of this.plugins) {
      try {
        if (typeof p.instance.onEvent === "function") {
          p.instance.onEvent(event);
        }
      } catch (e) {
        console.log("⚠️ Event error in:", name);
      }
    }
  }
}
