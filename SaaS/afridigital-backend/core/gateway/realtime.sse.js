const hub = require("../realtime/event.hub");

function attachSSE(app) {
  app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const push = (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    hub.on("event", push);

    req.on("close", () => {
      hub.off("event", push);
    });
  });
}

module.exports = { attachSSE };
