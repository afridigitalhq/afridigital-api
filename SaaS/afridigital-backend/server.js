const express = require("express");
const path = require("path");

const app = express();

// Serve static UI
app.use(express.static(path.join(__dirname, "public")));

// API test route
app.get("/api/test", (req, res) => {
  res.json({ status: "API working" });
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port:", PORT);
});
