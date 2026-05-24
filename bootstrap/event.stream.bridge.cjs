/**
 * 🌊 EVENT STREAM BRIDGE (FIXED STUB)
 * Temporary compatibility layer for server.js
 */

const bridge = require('../afridigital-core/kernel/bridge/event.bridge.cjs');

module.exports = {
  init(server) {
    console.log("🌊 STREAM BRIDGE ACTIVE");

    // attach server-level event passthrough
    if (server && server.on) {
      server.on("request", (req) => {
        bridge.emit("HTTP_REQUEST", {
          url: req.url,
          method: req.method
        });
      });
    }
  },

  emit(event, payload) {
    return bridge.emit(event, payload);
  }
};
