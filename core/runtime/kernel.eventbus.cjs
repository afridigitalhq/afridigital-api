const path = require('path');
const { assertKernel } = require('./kernel.guard.cjs');

const ACTIVE = path.resolve(__dirname, '../../dist/api/core/eventbus/index.js');

assertKernel(ACTIVE);

const bus = require(ACTIVE);

if (!bus || typeof bus.on !== 'function' || typeof bus.emit !== 'function') {
  throw new Error('KERNEL EVENTBUS INVALID');
}

global.__AFRI_KERNEL_EVENTBUS__ = global.__AFRI_KERNEL_EVENTBUS__ || bus;

module.exports = global.__AFRI_KERNEL_EVENTBUS__;
