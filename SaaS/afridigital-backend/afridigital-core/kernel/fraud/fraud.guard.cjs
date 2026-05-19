const riskScore = (payload) => {
  let score = 0;

  if (!payload.userId) score += 50;
  if (!payload.amount) score += 30;
  if (payload.amount > 100000) score += 40;

  return score;
};

function evaluate(payload) {
  const score = riskScore(payload);

  return {
    approved: score < 60,
    score
  };
}

module.exports = { evaluate };
