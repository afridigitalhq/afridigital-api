const crypto = require("crypto");

/**
 * KERNEL-SAFE BACKUP ADAPTER
 * ---------------------------------
 * - READ ONLY snapshot tool
 * - NO git push
 * - NO deploy triggers
 * - NO CI execution rights
 */

function hashState(state) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(state || {}))
    .digest("hex");
}

async function snapshotKernel(kernelState) {
  const snapshot = {
    ts: Date.now(),
    hash: hashState(kernelState),
    state: kernelState,
    mode: "READ_ONLY_SNAPSHOT"
  };

  // IMPORTANT: intentionally NO side effects
  return snapshot;
}

async function afribksync() {
  throw new Error(
    "EXECUTION_DISABLED: afribksync is now a read-only Kernel snapshot adapter. Use snapshotKernel(state) instead."
  );
}

module.exports = {
  snapshotKernel,
  afribksync
};
