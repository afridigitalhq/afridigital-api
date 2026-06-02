/**
 * SAFE KERNEL COMPATIBILITY LAYER
 * Matches expected server.js API without changing architecture
 */

function registerKernel() {
  console.log("🧠 Kernel registered (compat mode)");
}

function connect() {
  console.log("🧠 Kernel connected (compat mode)");
}

module.exports = {
  registerKernel,
  connect
};
