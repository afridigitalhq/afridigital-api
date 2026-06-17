const crypto = require("crypto");
const { commandBus } = require("../commandBus");
const { logEvent } = require("../audit/ledger");

function verifySignature(body, signature, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  return signature?.includes(hash);
}

async function handleWebhook(req, res) {
  if (!verifySignature(req.body, req.headers["x-hub-signature-256"], process.env.WHATSAPP_SECRET)) {
    return res.status(403).send("INVALID_SIGNATURE");
  }

  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const command = {
    source: "whatsapp",
    text: message.text?.body,
    from: message.from
  };

  await logEvent({ type: "WHATSAPP_IN", command });

  commandBus.execute(command);

  res.sendStatus(200);
}

module.exports = { handleWebhook };
