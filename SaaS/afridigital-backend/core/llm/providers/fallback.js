async function stream({ prompt, streamId, onToken }) {
  const words = ["fallback", "mode", "active"];

  for (const w of words) {
    onToken(w);
    await new Promise(r => setTimeout(r, 200));
  }
}

module.exports = { stream };
