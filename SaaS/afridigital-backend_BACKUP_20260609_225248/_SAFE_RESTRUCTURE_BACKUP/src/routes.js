const express = require("express");

const users = require("./api/admin/users");
const analytics = require("./db/services/analytics");
const exportService = require("./db/services/export");
const { verifyWhatsApp } = require("./webhooks/whatsapp/verifyWebhook");

const router = express.Router();

// HEALTH
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "afridigital-backend" });
});

// ADMIN USERS
router.get("/admin/users", users);

// ANALYTICS
router.get("/admin/analytics", async (req, res) => {
  const data = await analytics.getStats() || { ok: false };
  res.json(data);
});

// EXPORT (PDF/CSV placeholder safe)
router.get("/admin/export", async (req, res) => {
  const data = await exportService.exportAll?.() || { ok: false };
  res.json(data);
});

// WHATSAPP VERIFY HOOK
router.post("/webhook/whatsapp", (req, res) => {
  const ok = verifyWhatsApp(req, process.env.WHATSAPP_SECRET || "");
  if (!ok) return res.status(403).json({ error: "INVALID_SIGNATURE" });

  res.json({ status: "verified" });
});

module.exports = router;
