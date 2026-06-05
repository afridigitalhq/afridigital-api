function normalize(message) {
  return {
    from: message.from,
    text: message.text?.body || "",
    timestamp: Date.now(),
    platform: "whatsapp"
  };
}

module.exports = { normalize };
