module.exports = function format(result, intent) {
  return {
    ok: true,
    intent: intent.primary,
    confidence: intent.confidence,
    flow: result.flow,
    response: result.output
  };
};
