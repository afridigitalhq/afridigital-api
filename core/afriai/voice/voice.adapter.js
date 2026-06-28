/**
 * AfriAI Voice Adapter v1
 * Pure abstraction layer (no audio processing yet)
 */

function speechToText(audioInput) {
  // placeholder hook for future STT engine (Whisper / Web API / Android mic bridge)
  return {
    text: typeof audioInput === "string"
      ? audioInput
      : "VOICE_INPUT_PENDING_PROCESSOR",
    confidence: 0.5,
    source: "afriai_voice_stub"
  };
}

function textToSpeech(text) {
  // placeholder hook for TTS engine
  return {
    audio: null,
    text,
    status: "TTS_NOT_CONNECTED_YET"
  };
}

function normalizeVoiceInput(input) {
  return speechToText(input);
}

module.exports = {
  speechToSpeech: speechToText,
  textToSpeech,
  normalizeVoiceInput
};
