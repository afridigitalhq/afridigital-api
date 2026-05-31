const EventEmitter = require('events');
const bus = new EventEmitter();

const execute = require('../africore/runtime/kernelExecutor');

bus.on('api.ai', async (payload) => {
  await execute(payload);
});

module.exports = bus;
