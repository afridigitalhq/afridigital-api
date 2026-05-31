async function* normalize(stream) {
  // WebStream case
  if (stream?.getReader) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      yield decoder.decode(value);
    }
    return;
  }

  // Node stream case
  if (stream?.on) {
    for await (const chunk of stream) {
      yield chunk.toString();
    }
    return;
  }

  throw new Error("Unsupported stream type");
}

module.exports = { normalize };
