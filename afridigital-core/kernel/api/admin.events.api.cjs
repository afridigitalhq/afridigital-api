/**
 * 📊 AFRI ADMIN EVENT API
 * - Reads from EventTap buffer
 */

const eventTap = require("../tap/event.tap.cjs");

function registerAdminEventsRoute(app) {
  app.get("/api/admin/events", (req, res) => {
    const limit = parseInt(req.query.limit || "50");

    res.json({
      ok: true,
      source: "AFRI_EVENT_TAP",
      events: eventTap.getTraces(limit)
    });
  });

  app.post("/api/admin/events/clear", (req, res) => {
    eventTap.clear();
    res.json({ ok: true, cleared: true });
  });

  console.log("📊 Admin Event API mounted");
}

module.exports = registerAdminEventsRoute;
