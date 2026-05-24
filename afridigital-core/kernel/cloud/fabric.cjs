const ledger = require("../ledger/event.ledger.cjs");
const stream = require("../streams/redis.stream.cjs");

async function emit(event, payload = {}) {
  // 1. write to ledger (immutable history)
  ledger.append({ event, payload });

  // 2. push to distributed stream
  await stream.emit(event, payload);

  console.log("🌍 FABRIC EMIT:", event);
}

module.exports = { emit };
