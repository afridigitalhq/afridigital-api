async function streamLLM(prompt, onToken) {
  const words = ("Echo AI: " + prompt).split(" ");
  for (const w of words) {
    await new Promise(r => setTimeout(r, 80));
    onToken(w + " ");
  }
  return words.join(" ");
}

module.exports = { streamLLM };
