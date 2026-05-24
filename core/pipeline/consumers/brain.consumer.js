const eventCore = require('../../../afridigital-core/kernel/stable/event.core.cjs');

module.exports = function pipelineBrain() {
  eventCore.on('EVENT', (packet) => {
    console.log('🧠 PIPELINE EVENT:', packet.event);
  });
};
