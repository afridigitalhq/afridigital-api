const crypto = require("crypto");
const { handleWhatsApp } = require("../../core/whatsapp/controller");

/**
 * VERIFY META WEBHOOK (GET)
 */
function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

/**
 * VERIFY SIGNATURE (POST SECURITY)
 */
function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const body = JSON.stringify(req.body);
  const expected = crypto
    .createHmac("sha256", process.env.WHATSAPP_APP_SECRET)
    .update(body)
    .digest("hex");

  return signature === `sha256=${expected}`;
}

/**
 * MAIN WEBHOOK HANDLER
 */
module.exports = async (req, res) => {
  try {
    // META verification handshake
    if (req.method === "GET") {
      return verifyWebhook(req, res);
    }

    // security check
    if (!verifySignature(req)) {
      return res.status(401).json({ ok: false, error: "invalid signature" });
    }

    // extract WhatsApp message payload safely
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.json({ ok: true, ignored: true });
    }

    const payload = {
      text: message.text?.body || "",
      from: message.from,
      raw: req.body
    };

    const result = await handleWhatsApp(payload);

    return res.json(result);

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message
    });
  }
};
