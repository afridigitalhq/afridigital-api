const gateway = require("../../ai/gateway/v5/entry");
const { send } = require("../sender");

function chunkText(text, size = 1800) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

function simulateTyping(ms = 1200) {
  return new Promise(r => setTimeout(r, ms));
}

async function runStreaming(from, req) {
  const result = await gateway.runRequest(req);

  const text = result.text || "";
  const chunks = chunkText(text);

  // typing simulation before reply
  await simulateTyping(900);

  for (const chunk of chunks) {
    await send(from, chunk);
    await simulateTyping(600);
  }

  return result;
}

module.exports = { runStreaming };
