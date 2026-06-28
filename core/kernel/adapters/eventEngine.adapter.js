// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const eventEngine = require("../../event-engine");

module.exports = {
  normalize: eventEngine.normalize,
  route: eventEngine.route
};
