function scoreFn(truth) {
  let score = 50;

  if (truth?.db?.mongo === "ONLINE") score += 15;
  if (truth?.db?.redis === "ONLINE") score += 15;
  if (truth?.db?.postgres === "ONLINE") score += 10;

  if (truth?.meta?.integrity > 0) score += 5;
  if (truth?.snapshots?.total > 0) score += 5;

  return {
    score: Math.min(100, score)
  };
}

module.exports = scoreFn;
