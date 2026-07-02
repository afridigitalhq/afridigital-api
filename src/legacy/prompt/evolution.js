const history = [];

function trackPrompt(prompt, result) {
  history.push({ prompt, result, ts: Date.now() });
}

module.exports = { trackPrompt };
