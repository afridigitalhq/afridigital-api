const fs = require("fs");

/**
 * SIMPLE FAILOVER WATCHDOG
 * Restarts worker logic in-process if crash occurs
 */

let workerFn = null;
let running = false;

function register(fn) {
  workerFn = fn;
}

async function start() {
  if (!workerFn) throw new Error("No worker registered");

  running = true;

  while (running) {
    try {
      await workerFn();
    } catch (e) {
      console.log("⚠️ Worker crashed, restarting...", e.message);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function stop() {
  running = false;
}

module.exports = { register, start, stop };
