const stream = require('./stream/streamBus');
const ollama = require('./providers/ollamaProvider');

async function run({ streamId, text }) {
  if (!streamId) throw new Error("streamId required");

  stream.push(streamId, { type: "start", ts: Date.now() });

  try {
    const res = await ollama.generate({ text });

    const reader = res.body?.getReader?.();

    // CASE 1: WHATWG stream
    if (reader) {
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          handleLine(line, stream, streamId);
        }
      }
    }

    // CASE 2: Node stream fallback
    else if (res.body?.[Symbol.asyncIterator]) {
      let buffer = "";

      for await (const chunk of res.body) {
        buffer += chunk.toString();

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          handleLine(line, stream, streamId);
        }
      }
    }

    stream.push(streamId, { type: "done", ts: Date.now() });

  } catch (err) {
    stream.push(streamId, {
      type: "error",
      value: err.message,
      ts: Date.now()
    });
  }
}

function handleLine(line, stream, streamId) {
  if (!line.trim()) return;

  try {
    const json = JSON.parse(line);

    if (json.response) {
      stream.push(streamId, {
        type: "token",
        value: json.response,
        ts: Date.now()
      });
    }
  } catch (e) {}
}

module.exports = { run };
