const { parseWhatsAppPayload } = require("../parser/messageParser");

function messagePipeline(req) {
  const parsed = parseWhatsAppPayload(req.body);

  if (!parsed) {
    return { ok: false, reason: "INVALID_PAYLOAD" };
  }

  return { ok: true, message: parsed };
}

module.exports = { messagePipeline };
