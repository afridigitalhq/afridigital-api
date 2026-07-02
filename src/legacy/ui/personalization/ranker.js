function rankWidgets(weights) {

  const entries = Object.entries(weights);

  const sorted = entries.sort((a, b) => b[1] - a[1]);

  const base = ["copilot", "jobs", "wallet", "earnings", "boost"];

  const ranked = sorted.map(([k]) => k);

  // ensure missing widgets still appear
  base.forEach(w => {
    if (!ranked.includes(w)) ranked.push(w);
  });

  return ranked;
}

module.exports = { rankWidgets };
