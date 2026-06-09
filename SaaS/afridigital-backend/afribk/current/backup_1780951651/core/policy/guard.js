/**
 * 🛡️ POLICY ENGINE
 * prevents unsafe execution patterns
 */
function validateRequest(req) {

  if (!req.text) {
    throw new Error("EMPTY_INPUT");
  }

  if (req.text.length > 5000) {
    throw new Error("INPUT_TOO_LARGE");
  }

  return true;
}

module.exports = { validateRequest };
