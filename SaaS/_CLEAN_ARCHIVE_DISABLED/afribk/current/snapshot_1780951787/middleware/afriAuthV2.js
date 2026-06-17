const crypto = require("crypto");

function isAdmin(req) {
  const admin = process.env.AFRI_ADMIN_NUMBER;
  const sender = req.body?.from || "";

  return sender.includes(admin);
}

// optional request signature validation
function verifySignature(req) {
  const secret = process.env.AFRI_SECRET_KEY;
  const payload = JSON.stringify(req.body || {});
  const signature = req.headers["x-afri-signature"];

  if (!signature) return false;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return hash === signature;
}

module.exports = { isAdmin, verifySignature };
