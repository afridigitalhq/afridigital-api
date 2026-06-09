/**
 * 🧠 META INTEGRATION SAFETY LAYER
 * ensures no accidental system execution via WhatsApp
 */

function isSafeMessage(msg = "") {
  const blocked = ["rm -rf", "shutdown", "deploy", "restart", "exec", "node "];

  return !blocked.some(b => msg.toLowerCase().includes(b));
}

module.exports = {
  isSafeMessage
};
