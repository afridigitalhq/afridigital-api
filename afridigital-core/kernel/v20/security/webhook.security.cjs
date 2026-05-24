const crypto = require("crypto");

class WebhookSecurity {
  constructor(secret) {
    this.secret = secret || process.env.WHATSAPP_APP_SECRET || "";
  }

  verifySignature(payload, signature) {
    if (!this.secret) return true; // allow dev mode

    try {
      const expected = "sha256=" + crypto
        .createHmac("sha256", this.secret)
        .update(payload)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signature || "")
      );
    } catch (err) {
      return false;
    }
  }

  verifyToken(mode, token, challenge) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode !== "subscribe") return false;
    if (token !== verifyToken) return false;

    return challenge;
  }

  validateTimestamp(ts) {
    if (!ts) return true;

    const now = Date.now();
    const diff = Math.abs(now - ts);

    // reject requests older than 5 min
    return diff < 5 * 60 * 1000;
  }
}

module.exports = WebhookSecurity;
