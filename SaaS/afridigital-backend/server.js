const express = require("express");
require("dotenv").config({ override: true });

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afrios-backend" });
});

app.post("/webhook/whatsapp", (req, res) => {
  console.log("WEBHOOK:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 AfriOS running on port", PORT);
});
