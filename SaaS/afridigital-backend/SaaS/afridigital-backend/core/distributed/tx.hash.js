const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require("crypto");

class TxHash {
  static create(userId, amount, action) {
    return crypto
      .createHash("sha256")
      .update(`${userId}:${amount}:${action}:${Date.now() >> 8}`)
      .digest("hex");
  }
}

module.exports = TxHash;
