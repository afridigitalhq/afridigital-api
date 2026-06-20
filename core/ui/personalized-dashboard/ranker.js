function rankWidgets(weights) {

  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
}

module.exports = { rankWidgets };
