const bus = require("./telemetry.bus");
const startGraphStream = require("./graph.stream");
const attachWebSocket = require("./telemetry.ws");
const servers = [];

function registerServer(app, name = "unnamed") {
  servers.push({ app, name });
  console.log("🪝 AFRISCAN HOOK REGISTERED:", name);
}

function startAll(port = process.env.PORT || 3000) {
  servers.forEach((s, i) => {
    s.app.listen(port + i, () => {
      console.log("🚀 AFRISCAN ACTIVE:", s.name, "PORT:", port + i);
    });
  });
}

module.exports = { registerServer, startAll };
