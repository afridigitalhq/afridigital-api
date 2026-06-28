const { processEvent } = require("../orchestrator");

function registerCockpitRoutes(app, express) {

  app.post("/api/cockpit/event", express.json(), (req, res) => {
    const result = processEvent(req.body);
    res.json(result);
  });

}

module.exports = { registerCockpitRoutes };
