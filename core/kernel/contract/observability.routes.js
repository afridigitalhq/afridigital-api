// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
module.exports = (app, kernel) => {

  app.get("/api/kernel/observability", (req, res) => {
    res.json(kernel.snapshot());
  });

  app.get("/api/kernel/telemetry", (req, res) => {
    res.json(kernel.telemetry());
  });

  app.get("/api/kernel/ledger", (req, res) => {
    res.json(kernel.ledger());
  });

};
