const redis = require("../../redis/v6/client");

const STREAM_KEY = "afri:events";
const GROUP = "afri-group";
const CONSUMER = "worker-1";

async function ensureGroup() {
  try {
    await redis.xgroup("CREATE", STREAM_KEY, GROUP, "$", "MKSTREAM");
  } catch (e) {}
}

async function readBatch() {
  const res = await redis.xreadgroup(
    "GROUP",
    GROUP,
    CONSUMER,
    "COUNT",
    10,
    "BLOCK",
    2000,
    "STREAMS",
    STREAM_KEY,
    ">"
  );

  return res;
}

module.exports = { ensureGroup, readBatch };
