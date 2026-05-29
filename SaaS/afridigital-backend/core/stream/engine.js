const sse = require("./sse");

async function streamText(text, sessionId) {
  for (const ch of text) {
    await new Promise(r => setTimeout(r, 15));
    sse.send(sessionId, ch);
  }
  sse.close(sessionId);
  return text;
}

module.exports = { streamText };
