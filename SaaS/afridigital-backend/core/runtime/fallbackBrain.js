function fallbackBrain(text) {
  return {
    reply: `I received: ${text}. System running in safe mode.`,
    mode: "fallback-brain"
  };
}

module.exports = { fallbackBrain };
