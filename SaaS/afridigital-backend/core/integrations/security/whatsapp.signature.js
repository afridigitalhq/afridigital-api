/**
 * 🔐 WHATSAPP SIGNATURE VALIDATION (PRODUCTION READY)
 */

const crypto = require("crypto");

function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", process.env.WHATSAPP_APP_SECRET || "")
    .update(body)
    .digest("hex");

  if (!signature) return false;

  return signature.includes(expected);
}

module.exports = {
  verifySignature
};
