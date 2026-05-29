const memory = require('../memory/store');

/**
 * Build structured conversation summary
 */
function buildSummary(messages = []) {
  if (!messages.length) return null;

  const recent = messages.slice(-6);

  const topics = recent.map(m => m.text).join(" | ");

  return {
    messageCount: messages.length,
    lastMessages: recent,
    quickSummary: topics.slice(0, 180)
  };
}

/**
 * Infer basic user persona signals (lightweight, no AI dependency)
 */
function buildPersona(messages = [], lastIntent) {
  const text = messages.map(m => m.text.toLowerCase()).join(" ");

  return {
    isGreetingUser: text?.includes("hello") || text?.includes("hi"),
    isSupportSeeker: text?.includes("help"),
    isPriceFocused: text?.includes("price") || text?.includes("cost"),
    lastIntent: lastIntent || "unknown"
  };
}

/**
 * Context pack builder (core upgrade)
 * This is what your AI brain will consume
 */
function buildContext(userId) {
  const ctx = memory.getContext(userId);

  const summary = buildSummary(ctx.messages);
  const persona = buildPersona(ctx.messages, ctx.lastIntent);

  return {
    userId,
    summary,
    persona,
    lastIntent: ctx.lastIntent,
    rawMessageCount: ctx.messages.length
  };
}

/**
 * Lightweight enrichment hook
 */
function enrichPayload(payload) {
  const userId = payload.from || "anonymous";

  const context = buildContext(userId);

  return {
    ...payload,
    context
  };
}

module.exports = {
  buildContext,
  enrichPayload
};
