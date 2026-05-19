/**
 * ⚡ A3.18.3 LIVE RESPONSE EMITTER
 * Streams AI responses in real-time chunks
 */

const { publish } = require("../../event/bus");
const { createEvent } = require("../../event/types");

function emitThinking(trace) {
  publish(createEvent("AI_THINKING", trace));
}

function emitChunk(chunk) {
  publish(createEvent("AI_STREAM_CHUNK", { chunk }));
}

function emitFinal(result) {
  publish(createEvent("AI_FINAL_RESPONSE", result));
}

module.exports = {
  emitThinking,
  emitChunk,
  emitFinal
};
