const { Lifecycle } = require("./control/lifecycle");
const { Dispatcher } = require("./scheduler/dispatcher");
const { DAGTracer } = require("./dag/tracer");
const { Supervisor } = require("./supervisor/runtime");

const lifecycle = new Lifecycle();
const scheduler = new Dispatcher();
const dag = new DAGTracer();
const supervisor = new Supervisor();

console.log("🧠 V18.4 EXECUTION CONTROL PLANE ACTIVE");
console.log("━━━━━━━━━━━━━━━━━━━━━━");
console.log("✔ Lifecycle Engine: ONLINE");
console.log("✔ Scheduler: ACTIVE");
console.log("✔ DAG Tracer: LIVE");
console.log("✔ Worker System: READY");
console.log("✔ Supervisor: PROTECTING");

module.exports = {
  lifecycle,
  scheduler,
  dag,
  supervisor
};
