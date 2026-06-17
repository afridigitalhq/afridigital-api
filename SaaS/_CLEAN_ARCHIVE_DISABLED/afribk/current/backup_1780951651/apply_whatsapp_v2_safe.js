const fs = require("fs");

const deliveryPath = "./core/ai/gateway/v5/plugins/whatsapp/delivery.js";
const webhookPath = "./server.js";

// =====================
// 1. ENHANCED DELIVERY ENGINE WRAPPER
// =====================
const patch = `
// ===== WHATSAPP v2 SAFE DELIVERY LAYER =====

if (!global.__AFRI_WHATSAPP_STORE__) {
  global.__AFRI_WHATSAPP_STORE__ = [];
}

function createMsg(text, meta = {}) {
  return {
    msgId: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8),
    text,
    meta,
    status: "queued",
    ts: Date.now()
  };
}

async function enqueue(msg) {
  const message = createMsg(msg.text, msg.meta);

  global.__AFRI_WHATSAPP_STORE__.push(message);

  setTimeout(async () => {
    message.status = "processing";

    const words = (message.text || "").split(" ");
    let acc = "";

    for (let i = 0; i < words.length; i++) {
      acc += (i === 0 ? "" : " ") + words[i];

      console.log("📡 STREAM:", {
        msgId: message.msgId,
        type: i === words.length - 1 ? "final" : "chunk",
        text: acc
      });

      await new Promise(r => setTimeout(r, 20));
    }

    message.status = "delivered";

    console.log("✅ DELIVERED:", message.msgId);
  }, 10);

  return message;
}

module.exports = { enqueue };
`;

fs.writeFileSync(deliveryPath, patch);

// =====================
// 2. PATCH WEBHOOK SAFELY
// =====================
let server = fs.readFileSync(webhookPath, "utf8");

// remove old webhook safely
server = server.replace(
  /app\.post\(\"\/webhook\/whatsapp\"[\s\S]*?\}\);/g,
  ""
);

// inject safe webhook
const webhook = `
const whatsappDelivery = require("./core/ai/gateway/v5/plugins/whatsapp/delivery");

app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const { handleStreamingWhatsApp } =
      require("./core/ai/gateway/v5/plugins/whatsapp/kernelAdapter");

    const result = await handleStreamingWhatsApp(req.body || {});

    const msg = await whatsappDelivery.enqueue({
      text: req.body?.text || "",
      meta: result
    });

    return res.json({
      ok: true,
      msgId: msg.msgId,
      status: msg.status,
      reply: result.reply,
      streamed: true
    });

  } catch (err) {
    console.error("WHATSAPP V2 ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});
`;

server += "\n" + webhook;

fs.writeFileSync(webhookPath, server);

// syntax check
require("child_process").execSync("node -c server.js");

console.log("🚀 WHATSAPP v2 SAFE MODE ENABLED");
