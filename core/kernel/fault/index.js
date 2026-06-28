// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { CircuitBreaker } = require("./CircuitBreaker");
const { IsolationZone } = require("./IsolationZone");
const { FaultController } = require("./FaultController");

module.exports = {
  circuitBreaker: new CircuitBreaker({}),
  isolation: new IsolationZone(),
  faultController: new FaultController()
};
