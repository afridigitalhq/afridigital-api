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

// WhatsApp AI Webhook
const { generateAIResponse } = require("./services/ai.engine");

// Meta verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// Receive WhatsApp messages
app.post("/webhook", express.json(), async (req, res) => {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const userText = message.text?.body || "";

    const aiReply = await generateAIResponse(userText);

    console.log("User:", userText);
    console.log("AI:", aiReply);

    // NOTE: sending reply back to WhatsApp API will be added next step

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.sendStatus(500);
  }
});
