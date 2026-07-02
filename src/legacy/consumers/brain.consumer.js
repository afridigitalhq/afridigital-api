const eventCore = require('../../afridigital-core/kernel/stable/event.core.cjs');

module.exports = function brainConsumer() {
  eventCore.on('EVENT', (packet) => {
    console.log('🧠 BRAIN EVENT:', packet.event);
  });
};
