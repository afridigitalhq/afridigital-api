/**
 * 📊 AFRI EVENT DASHBOARD API v1
 * - Exposes EventTap buffer via HTTP
 */

const express = require("express");
const router = express.Router();

// safe lazy import (prevents boot crash if tap missing)
let eventTap;
try {
  eventTap = require("../../afridigital-core/kernel/tap/event.tap.cjs");
} catch (e) {
  console.warn("⚠️ EventTap not available");
}

/**
 * GET /events/traces
 * Returns last N event traces
 */
router.get("/traces", (req, res) => {
  const limit = parseInt(req.query.limit || "50", 10);

  if (!eventTap) {
    return res.json({
      status: "NO_TAP",
      traces: []
    });
  }

  const traces = eventTap.getTraces(limit);

  res.json({
    status: "OK",
    count: traces.length,
    traces
  });
});

/**
 * DELETE /events/traces
 * Clears buffer (debug control)
 */
router.delete("/traces", (req, res) => {
  if (!eventTap) {
    return res.json({ status: "NO_TAP" });
  }

  eventTap.clear();

  res.json({
    status: "CLEARED"
  });
});

module.exports = router;
