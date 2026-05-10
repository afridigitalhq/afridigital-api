const { normalizeMessage } = require('./message.normalizer');
const { orchestrateMessage } = require('../orchestrator/message.orchestrator');
const { sendWhatsAppMessage } = require('../transport/whatsapp.sender');
const { isAdmin } = require('../auth/admin.guard');

async function handleIncoming(payload) {

  const normalized =
    normalizeMessage(payload);

  const admin =
    isAdmin(normalized.sender);

  const response =
    await orchestrateMessage({
      message: normalized.message,
      sender: normalized.sender,
      isAdmin: admin
    });

  await sendWhatsAppMessage(
    normalized.sender,
    response
  );

  return {
    success: true
  };
}

module.exports = { handleIncoming };
