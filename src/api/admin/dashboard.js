export function registerAdminDashboard(app, kernelRef){

  // SYSTEM STATE SNAPSHOT
  app.get("/api/admin/system", (req, res) => {
    res.json({
      status: "active",
      timestamp: Date.now(),
      message: "AfriDigital OS Running"
    });
  });

  // EVENT STREAM (light snapshot only)
  app.get("/api/admin/events", (req, res) => {
    res.json({
      status: "connected",
      note: "Live stream will be upgraded via websocket layer"
    });
  });

  // PLUGIN STATUS
  app.get("/api/admin/plugins", (req, res) => {
    res.json({
      status: "ok",
      plugins: "runtime-loaded (hook pending full registry bind)"
    });
  });

  console.log("🖥️ Admin Dashboard API READY");
}
