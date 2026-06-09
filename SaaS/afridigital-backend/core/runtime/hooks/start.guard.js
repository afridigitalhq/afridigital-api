/**
 * 🧱 STARTUP GUARD
 * Prevents double initialization on Render
 */

let started = false;

function guardStart(fn) {
  if (started) {
    console.log("🧠 SERVER ALREADY INITIALIZED — SKIPPING");
    return;
  }

  started = true;
  return fn();
}

module.exports = { guardStart };
