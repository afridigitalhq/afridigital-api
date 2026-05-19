/**
 * 📊 A3.18.14 MESSAGE SCORING ENGINE
 * Evaluates AI response quality
 */

function scoreMessage(context) {

  const {
    userReplied,
    responseTimeMs,
    error,
    messageLength
  } = context;

  let score = 0.5;

  if (userReplied) score += 0.3;
  if (responseTimeMs < 2000) score += 0.2;
  if (error) score -= 0.5;
  if (messageLength > 0) score += 0.1;

  return {
    score: Math.max(0, Math.min(1, score)),
    label:
      score > 0.7 ? "GOOD" :
      score > 0.4 ? "AVERAGE" :
      "BAD"
  };
}

module.exports = { scoreMessage };
