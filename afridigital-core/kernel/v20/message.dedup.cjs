const crypto = require("crypto");

async function isDuplicate(redis, message) {
  const hash = crypto
    .createHash("sha256")
    .update(typeof message === "string" ? message : JSON.stringify(message))
    .digest("hex");

  const key = `dedup:${hash}`;

  const exists = await redis.get(key);
  if (exists) return true;

  await redis.set(key, "1", { EX: 86400, NX: true });
  return false;
}

module.exports = { isDuplicate };
