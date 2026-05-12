process.on("uncaughtException", e => console.log("💥 CRASH GUARD:", e));
process.on("unhandledRejection", e => console.log("💥 PROMISE ERROR:", e));
console.log("🔥 SERVER ENTRY ACTIVE")
console.log("🔥 SERVER ENTRY ACTIVE");
console.log("🚀 SERVER BOOT LIVE");
process.on("uncaughtException", e => console.log("💥 CRASH", e));
process.on("unhandledRejection", e => console.log("💥 PROMISE", e));
const express = require("express");
const app = express();
console.log("🧠 SERVER INIT LOADED");

app.use(express.json());
app.use("/webhook", require("./routes/webhook.routes"));
app.use("/webhook", require("./routes/webhook.routes"));

// HEALTH
app.get("/", (req, res) => {
  res.json({ status: "OK", service: "AfriDigital API" });
});

// LOG ALL REQUESTS
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// ENGINE (SAFE)
try {
  const engine = require("./services/whatsapp.engine");

console.log("🧠 ENGINE BOOT PROBE ACTIVE");
console.log("ENGINE EXISTS:", !!engine);
console.log("STARTWORKER TYPE:", typeof engine?.startWorker);

  if (engine?.startWorker) {
    console.log("🚀 FORCED ENGINE START INITIATED");
try {
  engine.startWorker();
  console.log("🚀 ENGINE START CONFIRMED");
} catch (e) {
  console.log("💥 ENGINE START FAILED:", e.message);
}
    console.log("🚀 ENGINE STARTED");
  }
} catch (e) {
  console.log("💥 ENGINE ERROR:", e.message);
}

// WEBHOOK (DIRECT - NO ROUTER)
app.post("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log("📩", JSON.stringify(req.body));

  const entries = req.body?.entry || [];

  for (const e of entries) {
    for (const c of e.changes || []) {
      const messages = c.value?.messages || [];

      for (const m of messages) {
        console.log("📥 MESSAGE:", m.from, m.text?.body);
      }
    }
  }

  res.sendStatus(200);
});

// START
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 RUNNING ON PORT", PORT);
});
console.log("🚀 ENGINE START CALLED")
