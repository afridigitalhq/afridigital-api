const { runStream } = require('./engine');

async function runRequest({ text }) {
  const stream = await runStream({ text });

  let final = "";

  for await (const chunk of stream) {
    final += chunk.response;
  }

  return { text: final };
}

module.exports = { runRequest };
