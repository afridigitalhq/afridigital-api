/**
 * 🧠 A3.18.11 AI RESPONSE QUALITY TRACKER
 * Evaluates AI replies WITHOUT modifying system behavior
 */

function evaluateQuality(replyEvent) {

  const text = replyEvent.payload.reply || "";

  const score =
    text.length > 20 ? 0.4 : 0.1 +
    (text.includes("error") ? -0.5 : 0) +
    (text.includes("processed") ? 0.2 : 0);

  return {
    replyId: replyEvent.id,
    qualityScore: Math.max(0, score),
    flagged: score < 0.2,
    ts: Date.now()
  };
}

module.exports = { evaluateQuality };
