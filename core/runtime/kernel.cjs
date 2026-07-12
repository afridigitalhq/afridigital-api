const eventbus = require('./kernel.eventbus.cjs');
const { assertKernel } = require('./kernel.guard.cjs');

function load(file) {
  assertKernel(file);
  return require(file);
}

module.exports = {
  eventbus,
  assertKernel,
  load
};
