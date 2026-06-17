/**
 * 🧪 WEBHOOK SELF TEST UTIL
 * Used to validate Render + Meta connection
 */

function webhookSelfTest(req, res) {
  res.json({
    status: "ok",
    service: "whatsapp-webhook",
    timestamp: Date.now(),
    meta: {
      has_token: !!process.env.META_TOKEN,
      has_phone_id: !!process.env.META_PHONE_ID,
      has_verify: !!process.env.WHATSAPP_VERIFY_TOKEN
    }
  });
}

module.exports = { webhookSelfTest };
