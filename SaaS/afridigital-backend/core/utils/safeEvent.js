function normalizeEvent(event) {
  const text =
    event?.payload?.text ||
    event?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
    "";

  return {
    ...event,
    safe: {
      text: String(text || ""),
      from:
        event?.payload?.from ||
        event?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        "unknown"
    }
  };
}

module.exports = { normalizeEvent };
