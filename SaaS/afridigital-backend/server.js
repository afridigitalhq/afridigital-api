const express = require("express");
const app = express();
app.get("/render-health",(req,res)=>res.json({ok:true,source:"render"}));
app.get("/health",(req,res)=>res.json({ok:true,service:"afridigital-api"}));

app.use(express.json());

/**
 * CORE HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afridigital-api",
    ts: Date.now()
  });
});

/**
 * WHATSAPP WEBHOOK ENTRY (RENDER SAFE)
 */
app.post("/webhook/whatsapp", (req, res) => {
  console.log("📩 WHATSAPP EVENT:", JSON.stringify(req.body || {}));
  res.sendStatus(200);
});

/**
 * AFRIAGENT TEST HOOK (SAFE SANITY CHECK)
 */
app.post("/afriagent/test", async (req, res) => {
  try {
    return res.json({
      ok: true,
      mode: "backend-stable",
      message: "AfriAgent pipeline ready for wiring"
    });
  } catch (e) {
    return res.json({ ok: false, error: e.message });
  }
});

/**
 * START SERVER (SINGLE SOURCE OF TRUTH)
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 AfriDigital API running on port", PORT);
});
