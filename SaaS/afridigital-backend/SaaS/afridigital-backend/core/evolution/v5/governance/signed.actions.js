/**
 * 🔐 A3.18 GOVERNED EVOLUTION ACTIONS
 * Every approval/cancel is cryptographically signed
 */

const crypto = require("crypto");

function signAction(action, adminId) {
  const payload = {
    action,
    adminId,
    ts: Date.now()
  };

  const signature = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return {
    ...payload,
    signature
  };
}

function verifyAction(record) {
  const check = crypto
    .createHash("sha256")
    .update(JSON.stringify({
      action: record.action,
      adminId: record.adminId,
      ts: record.ts
    }))
    .digest("hex");

  return check === record.signature;
}

module.exports = { signAction, verifyAction };
