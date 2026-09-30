import crypto from "node:crypto";

const usedNonces = new Map();
const NONCE_TTL_MS = 5 * 60 * 1000;

const AfriA2ARequestAuth = {
  verify({ agentId, timestamp, nonce, body, signature }) {
    const secret = process.env.A2A_SHARED_SECRET;

    if (!secret) {
      return { verified: false, code: "A2A_AUTH_NOT_CONFIGURED" };
    }

    if (!agentId || !timestamp || !nonce || !signature) {
      return { verified: false, code: "A2A_AUTH_REQUIRED" };
    }

    const age = Math.abs(Date.now() - Number(timestamp));

    if (!Number.isFinite(Number(timestamp)) || age > 5 * 60 * 1000) {
      return { verified: false, code: "A2A_REQUEST_EXPIRED" };
    }

    const nonceKey = `${agentId}:${nonce}`;
    const now = Date.now();

    for (const [key, expiresAt] of usedNonces) {
      if (expiresAt <= now) usedNonces.delete(key);
    }

    if (usedNonces.has(nonceKey)) {
      return { verified: false, code: "A2A_NONCE_REPLAYED" };
    }

    const payload = JSON.stringify({
      agentId,
      timestamp: Number(timestamp),
      nonce,
      body
    });

    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const supplied = String(signature).replace(/^HMAC-/i, "");

    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(
        Buffer.from(supplied),
        Buffer.from(expected)
      )
    ) {
      return { verified: false, code: "A2A_SIGNATURE_INVALID" };
    }

    usedNonces.set(nonceKey, now + NONCE_TTL_MS);

    return {
      verified: true,
      algorithm: "HMAC-SHA256",
      agentId,
      timestamp: Number(timestamp),
      nonce
    };
  }
};

export default AfriA2ARequestAuth;
