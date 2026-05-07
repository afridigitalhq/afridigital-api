const { on, channels, emit } = require("../redis/redis.spine.cjs");

function scoreTransaction(tx) {
  let score = 0;

  if (tx.amount > 100000) score += 40;
  if (!tx.userVerified) score += 30;
  if (tx.source === "whatsapp") score += 10;

  return score;
}

on(channels.payments, (tx) => {
  const score = scoreTransaction(tx);

  const result = {
    tx,
    score,
    status: score > 60 ? "FLAGGED" : "APPROVED"
  };

  emit(channels.fraud, result);
});
