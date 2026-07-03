export default function socRoute(app) {
  app.get("/api/soc", (req, res) => {
    res.json({
      status: "SOC ONLINE",
      modules: ["kernel", "events", "intelligence", "ci"],
      mode: "safe-layer-1"
    });
  });
}
