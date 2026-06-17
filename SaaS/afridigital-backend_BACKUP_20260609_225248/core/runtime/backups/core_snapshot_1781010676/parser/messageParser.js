function parseWhatsAppPayload(body) {
  try {
    const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return null;

    return {
      messageId: msg.id,
      from: msg.from,
      text: msg.text?.body || "",
      timestamp: Date.now()
    };
  } catch (e) {
    return null;
  }
}

module.exports = { parseWhatsAppPayload };
