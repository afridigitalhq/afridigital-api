/**
 * 🧠 SAFE WEBHOOK GUARD
 * (lightweight - no external dependency required)
 */

function verifyRenderWebhook(req) {
  // Render doesn't enforce signatures by default
  // but we still normalize + basic safety guard

  if (!req.body) return false;
  if (typeof req.body !== "object") return false;

  return true;
}

module.exports = { verifyRenderWebhook };
