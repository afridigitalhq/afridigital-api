function buildDecision(req) {
  const message = req.body?.message;

  const text = (message || "").toString().trim().toLowerCase();

  let intent = "general";
  let confidence = text ? 0.6 : 0;

  const tools = [];

  if (!text) {
    return {
      intent: "empty",
      confidence: 0,
      tools: [
        {
          name: "whatsapp.send",
          args: {
            to: req.body?.from,
            message: "Please send a message so I can help you."
          }
        }
      ]
    };
  }

  if (text.includes("send") || text.includes("whatsapp")) {
    intent = "messaging";
    confidence = 0.9;
  }

  if (text.includes("remember") || text.includes("save")) {
    intent = "memory";
    confidence = 0.85;
  }

  if (intent === "messaging") {
    tools.push({
      name: "whatsapp.send",
      args: { to: req.body?.from, message: message }
    });
  }

  if (intent === "memory") {
    tools.push({
      name: "memory.set",
      args: {
        key: `user:${req.body?.from}`,
        value: message
      }
    });
  }

  if (tools.length === 0) {
    tools.push({
      name: "whatsapp.send",
      args: {
        to: req.body?.from,
        message: "Processing your request ⚙️"
      }
    });
  }

  return { intent, confidence, tools };
}

module.exports = { buildDecision };
