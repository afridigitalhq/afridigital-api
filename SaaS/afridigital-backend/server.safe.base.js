const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afri-backend", status: "running" });
});

app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    console.log("WEBHOOK:", { id: msg.id, from: msg.from });
    return res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK_ERROR:", err.message);
    return res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 CLEAN V6 SERVER RUNNING ON", PORT);
});
