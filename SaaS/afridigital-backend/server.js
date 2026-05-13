const express = require("express");

console.log("🔥 SERVER ENTRY ACTIVE");

const app = express();
const PORT = process.env.PORT || 10000;

process.on("uncaughtException", e => {
  console.log("💥 UNCAUGHT EXCEPTION:", e);
});

process.on("unhandledRejection", e => {
  console.log("💥 UNHANDLED REJECTION:", e);
});

app.use(express.json());

console.log("🧩 MOUNTING WEBHOOK ROUTE");
app.use("/webhook", require("./routes/webhook.routes"));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "AfriDigital API"
  });
});

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
