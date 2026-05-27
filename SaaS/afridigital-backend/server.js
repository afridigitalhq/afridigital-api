const express = require("express");
const app = express();

app.use(express.json());

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afrios" });
});

// TEST ROUTE
app.post("/afriagent/test", async (req, res) => {
  try {
    res.json({
      ok: true,
      status: "afriagent alive"
    });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ROOT
app.get("/", (req, res) => {
  res.send("AfriOS running");
});

app.listen(PORT, () => {
  console.log("🚀 AfriOS running on port", PORT);
});
