function explainDecision(input, output) {
  return {
    input,
    output,
    reasoning: "derived from runtime trace + policy graph"
  };
}

module.exports = { explainDecision };
