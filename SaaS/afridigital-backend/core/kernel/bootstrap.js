const express = require("express");

class A2Kernel {
  constructor() {
    this.app = express();
    this.plugins = new Map();
    this.booted = false;
  }

  usePlugin(name, fn) {
    if (this.plugins.has(name)) return; // 🔒 idempotent protection
    this.plugins.set(name, fn);
    fn(this.app);
  }

  startServer(port = 3000) {
    if (this.booted) return;

    this.app.use(express.json());

    this.app.get("/health", (_, res) => {
      res.json({ ok: true, kernel: "A2-KERNEL-V1" });
    });

    this.app.listen(port, "0.0.0.0", () => {
      console.log("🚀 A2 KERNEL v1 RUNNING ON", port);
    });

    this.booted = true;
  }

  getApp() {
    return this.app;
  }
}

module.exports = new A2Kernel();
