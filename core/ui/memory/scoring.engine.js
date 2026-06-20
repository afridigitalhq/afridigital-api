function calculateScore(data) {

  const { sessions = 1, engagement = 0, conversions = 0 } = data;

  return (engagement * 0.6) + (conversions * 1.5) / sessions;
}

function rankModes(userMemory) {

  const ranked = Object.entries(userMemory)
    .map(([mode, data]) => ({
      mode,
      score: calculateScore(data)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked;
}

module.exports = { calculateScore, rankModes };
