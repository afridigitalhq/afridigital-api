const router = require("./decision.router.v2");
const bus = require("./event.bus");

async function handle(msg) {
  const decision = await router.routeMessage(msg);

  bus.emit("decision.route.v2", {
    msg,
    decision
  });

  return decision;
}

module.exports = { handle };
