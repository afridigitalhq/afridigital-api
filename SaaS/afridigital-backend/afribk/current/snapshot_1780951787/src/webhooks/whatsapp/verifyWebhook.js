const crypto = require("crypto");

function verifyWhatsApp(req, secret) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return signature.includes(hash);
}

module.exports = { verifyWhatsApp };
