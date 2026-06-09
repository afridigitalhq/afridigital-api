const crypto = require("crypto");

const seen = new Map();

function verifySignature(req) {
  const sig = req.headers["x-hub-signature-256"];
  if (!sig) return false;

  const expected = crypto
    .createHmac("sha256", process.env.META_APP_SECRET || "")
    .update(req.rawBody || "")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(sig.replace("sha256=", ""))
    );
  } catch {
    return false;
  }
}

function isDuplicate(id) {
  if (seen.has(id)) return true;
  seen.set(id, Date.now());
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of seen.entries()) {
    if (now - v > 3600000) seen.delete(k);
  }
}, 60000);

async function processMessage(msg) {
  const { handleMessage } = require("../whatsapp/controller");

  return handleMessage({
    id: msg.id,
    from: msg.from,
    text: msg.text?.body || "",
    ts: Date.now()
  });
}

async function whatsappWebhook(req, res) {
  try {
    if (!verifySignature(req)) return res.sendStatus(401);

    const msg =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    if (isDuplicate(msg.id)) return res.sendStatus(200);

    setImmediate(() => {
      processMessage(msg).catch(err =>
        console.log("WEBHOOK_ERR:", err.message)
      );
    });

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(200);
  }
}

module.exports = { whatsappWebhook };
