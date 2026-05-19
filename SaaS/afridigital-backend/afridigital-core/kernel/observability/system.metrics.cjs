const bus = require("../core/context.cjs");

console.log("\n📊 V12 OBSERVABILITY SNAPSHOT\n");

console.log({
  frontend: bus.services.frontend,
  backend: bus.services.backend,
  state: bus.state,
  events: bus.events.length
});
