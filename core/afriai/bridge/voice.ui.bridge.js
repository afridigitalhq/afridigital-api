/**
 * AfriAI Voice → UI Bridge v1
 * Connects voice adapter to chat pipeline (no audio processing)
 */

const { normalizeVoiceInput } = require("../voice/voice.adapter");

function bridgeVoiceToText(input) {
  const result = normalizeVoiceInput(input);

  return {
    text: result.text,
    confidence: result.confidence,
    source: "voice-ui-bridge-v1"
  };
}

module.exports = { bridgeVoiceToText };
