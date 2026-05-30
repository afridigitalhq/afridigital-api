const redis = require('../redis/client');

/**
 * Typing Bridge (SAFE OFFLINE MODE)
 */

function startTypingBridge() {

  const sub =
    redis && typeof redis.duplicate === 'function'
      ? redis.duplicate()
      : redis;

  if (!sub || typeof sub.on !== 'function') {
    console.log('⚠️ TypingBridge OFFLINE MODE');
    return;
  }

  console.log('📡 TypingBridge ACTIVE');

  sub.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log('⌨️ typing event:', data);
    } catch (e) {
      console.log('⚠️ invalid message');
    }
  });
}

module.exports = {
  startTypingBridge
};
