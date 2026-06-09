const crypto = require("crypto");

function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_SECRET) {
    console.log("🟢 WhatsApp WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha256", process.env.WHATSAPP_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return signature.includes(hash);
}

module.exports = { verifyWebhook, verifySignature };
