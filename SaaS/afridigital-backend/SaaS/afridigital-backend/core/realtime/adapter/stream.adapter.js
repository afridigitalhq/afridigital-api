/**
 * 🌐 STREAM ADAPTER (A3.18.3)
 * Converts execution engine into streaming pipeline
 */

const { emitThinking, emitChunk, emitFinal } = require("../emitter/live.emitter");

async function streamExecute(fn, input) {

  emitThinking({
    stage: "START",
    input
  });

  const result = await fn(input);

  // simulate streaming response
  const text = typeof result === "string"
    ? result
    : JSON.stringify(result);

  const chunks = text.match(/.{1,30}/g) || [];

  for (const c of chunks) {
    emitChunk(c);
    await new Promise(r => setTimeout(r, 50));
  }

  emitFinal(result);

  return result;
}

module.exports = { streamExecute };
