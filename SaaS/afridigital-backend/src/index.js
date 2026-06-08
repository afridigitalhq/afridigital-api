require("../core/kernel/config/loader");
const express = require("express");


const { logEvent } = require("./audit/ledger");

// SAFE IMPORTS (fallback tolerant)
let getAdminStats;
try {
  ({ getAdminStats } = require("./admin"));
} catch (e) {
  getAdminStats = (req, res) =>
    res.json({ status: "DEGRADED_ADMIN", message: "admin module missing" });
}

const app = express();
app.use(express.json());

// ---------------- HEALTH ----------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "V32_RENDER_READY",
    uptime: process.uptime()
  });
});

// ---------------- WHATSAPP WEBHOOK ----------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe") {
    return res.status(200).send(challenge || "OK");
  }

  res.status(403).send("Forbidden");
});

app.post("/webhook", async (req, res) => {
  try {
    await logEvent({
      type: "WHATSAPP_EVENT",
      payload: req.body || {}
    });

    res.json({ status: "received" });
  } catch (e) {
    res.json({ status: "logged_in_fallback" });
  }
});

// ---------------- ADMIN ----------------
app.get("/admin/stats", getAdminStats);

// ---------------- START SERVER (RENDER SAFE) ----------------
const PORT = process.env.PORT || 10000;


app.get('/env-debug', (req,res)=>{
  res.json({
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID,
    META_VERIFY_TOKEN: !!process.env.META_VERIFY_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL,
    ALL_KEYS: Object.keys(process.env).filter(k=>k.includes('META') || k.includes('REDIS'))
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log("🧠 V32 RENDER BACKEND LIVE ON PORT", PORT);
});
