const fs = require('fs');

const serverPath = './server.js';

// backup
fs.writeFileSync(serverPath + '.backup', fs.readFileSync(serverPath, 'utf8'));

let code = fs.readFileSync(serverPath, 'utf8');

// avoid duplicate injection
if (!code.includes('core/ai/gateway/v5/plugins/whatsapp/delivery')) {
  code = `const whatsappDeliveryEngine = require("./core/ai/gateway/v5/plugins/whatsapp/delivery");\n` + code;
}

// remove old webhook if exists (safe trim)
code = code.replace(/app\.post\(\"\/webhook\/whatsapp\"[\s\S]*?\n\}\);/g, '');

// clean webhook injection (NO template strings inside bash)
const webhook =
`app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const { handleStreamingWhatsApp } =
      require("./core/ai/gateway/v5/plugins/whatsapp/kernelAdapter");

    const engine = require("./core/ai/gateway/v5/plugins/whatsapp/delivery");

    const result = await handleStreamingWhatsApp(req.body || {});

    await engine.enqueue({
      text: req.body?.text || "",
      meta: result
    });

    return res.json({
      ok: true,
      queued: true,
      reply: result.reply,
      streamed: result.streamed
    });

  } catch (err) {
    console.error("WHATSAPP ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});`;

code += "\n" + webhook;

fs.writeFileSync(serverPath, code);

require('child_process').execSync('node -c server.js');

console.log("🚀 WhatsApp wired safely (NO SHELL RISK)");
