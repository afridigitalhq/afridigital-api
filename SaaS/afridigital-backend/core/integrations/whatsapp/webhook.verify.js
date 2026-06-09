/**
 * 🔐 WHATSAPP WEBHOOK VERIFICATION
 */

function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.log("🟢 WhatsApp webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

module.exports = {
  verifyWebhook
};
