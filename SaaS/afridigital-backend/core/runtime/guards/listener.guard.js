/**
 * 🧹 Listener containment layer
 * Prevents duplicate event registration explosion
 */

const registered = new Set();

function safeRegister(id, fn) {
  if (registered.has(id)) {
    console.log("🧠 DUPLICATE BLOCKED:", id);
    return;
  }
  registered.add(id);
  return fn;
}

module.exports = { safeRegister };
