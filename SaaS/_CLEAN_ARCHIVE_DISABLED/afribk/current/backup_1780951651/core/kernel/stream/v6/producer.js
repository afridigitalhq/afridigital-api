const redis = require("../../redis/v6/client");

const STREAM_KEY = "afri:events";

async function emit(event) {
  return redis.xadd(
    STREAM_KEY,
    "*",
    "data",
    JSON.stringify(event)
  );
}

module.exports = { emit };
