const express = require('express');

const app = express();
app.use(express.json());

console.log("🧪 BOOT STARTED");

// isolate crash source
let memory;

try {
  memory = require('./core/memory/store');
  console.log("✔ MEMORY LOADED");
} catch (e) {
  console.error("❌ MEMORY LOAD FAILED:", e);
}

app.get('/health', (req, res) => {
  res.json({ ok: true, mode: "isolation-test" });
});

app.post('/webhook', (req, res) => {
  try {
    console.log("📩 REQUEST:", req.body);

    if (!memory) {
      throw new Error("Memory module not loaded");
    }

    if (typeof memory.pushMessage !== "function") {
      throw new Error("Memory API broken");
    }

    memory.pushMessage(req.body.from, req.body);

    res.json({
      ok: true,
      reply: `Echo: ${req.body.text}`
    });

  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err);
    res.json({
      ok: false,
      error: err.message,
      stack: err.stack
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 ISOLATION SERVER RUNNING ON", PORT);
});
