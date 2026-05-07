const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// WhatsApp routes FIRST
app.use("/", require("./routes/whatsapp"));

// API test route
app.get("/api/test", (req, res) => {
  res.json({ status: "API working" });
});

// SPA fallback LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port:", PORT);
});
