module.exports = function (app) {

  app.get("/whatsapp/health", (req, res) => {
    res.json({
      ok: true,
      service: "whatsapp",
      status: "safe-mode"
    });
  });

};
