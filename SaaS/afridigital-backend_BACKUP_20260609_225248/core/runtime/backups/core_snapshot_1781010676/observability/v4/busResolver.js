/**
 * BUS RESOLVER (SINGLE SOURCE OF TRUTH)
 * Finds the correct event bus without fragile relative paths
 */

let cachedBus = null;

function resolveBus() {
  if (cachedBus) return cachedBus;

  try {
    // PRIMARY BUS (stable core system)
    cachedBus = require("../../eventbus");
    return cachedBus;
  } catch (e1) {}

  try {
    // FALLBACK BUS
    cachedBus = require("../../events/bus");
    return cachedBus;
  } catch (e2) {}

  try {
    // AI fallback
    cachedBus = require("../../ai/gateway/stream/bus");
    return cachedBus;
  } catch (e3) {}

  throw new Error("No valid EventBus found in system");
}

module.exports = {
  resolveBus
};
