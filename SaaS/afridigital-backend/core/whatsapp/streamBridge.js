
/* REDIS_OFFLINE_SAFE STREAM BRIDGE */

const bus = require('../events/bus');
const redis = require('../redis/client');
const { sendWhatsAppMessage } = require('./gateway');

const CHANNEL = 'afriai:tokens';

const buffers = new Map();
const FLUSH_MS = 800;

function scheduleFlush(user){
  if (!buffers.has(user)) return;

  const timer = setTimeout(async () => {
    const data = buffers.get(user);
    if (!data) return;

    const text = (data.buffer || []).join('');

    if (text.trim().length > 0) {
      await sendWhatsAppMessage(user, text);
    }

    buffers.delete(user);
  }, FLUSH_MS);

  buffers.get(user).timer = timer;
}

function startWhatsAppStreamBridge(){

  const sub =
    redis && typeof redis.duplicate === 'function'
      ? redis.duplicate()
      : redis;

  if (!sub || typeof sub.on !== 'function') {
    console.log('⚠️ StreamBridge OFFLINE MODE (no Redis)');
    return;
  }

  sub.on('message', async (_, msg) => {
    try {
      const { sessionId, token } = JSON.parse(msg);

      if (!buffers.has(sessionId)) {
        buffers.set(sessionId, { buffer: [], timer: null });
      }

      const entry = buffers.get(sessionId);
      entry.buffer.push(token);

      scheduleFlush(sessionId);

    } catch (e) {
      console.log('⚠️ stream parse error:', e.message);
    }
  });

  console.log('📡 WhatsApp Stream Bridge ACTIVE');
}

module.exports = { startWhatsAppStreamBridge };
