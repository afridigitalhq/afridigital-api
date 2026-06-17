/**
 * 🧠 AFRISCAN RUNTIME LOCK
 * prevents multiple runtime initializations
 */

let initialized = false;

function lockRuntime(name = "default") {
  if (initialized) {
    console.log("🧠 RUNTIME LOCKED: duplicate init blocked →", name);
    return false;
  }

  initialized = true;
  console.log("🧠 RUNTIME INITIALIZED:", name);
  return true;
}

module.exports = {
  lockRuntime
};
