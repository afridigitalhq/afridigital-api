const EventEmitter = require("events");

let redisClient = null;
const memoryBus = new EventEmitter();

// try attach redis safely
try {
  const redis = require("./index");
  redisClient = redis?.client || null;
} catch (e) {
  redisClient = null;
}

/**
 * Publish event (dual mode)
 */
async function publish(event, payload) {
  // Redis stream mode
  if (redisClient && redisClient.xAdd) {
    try {
      return await redisClient.xAdd("ai:stream", "*", {
        event,
        data: JSON.stringify(payload)
      });
    } catch (e) {}
  }

  // fallback memory event bus
  memoryBus.emit(event, payload);
  return true;
}

/**
 * Subscribe event (dual mode)
 */
function subscribe(event, handler) {
  // memory mode always works
  memoryBus.on(event, handler);

  // redis fallback noop (future extension)
  return () => memoryBus.off(event, handler);
}

/**
 * Safe emitter interface
 */
module.exports = {
  publish,
  subscribe,
  memoryBus,
  redisClient
};
