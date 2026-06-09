const usage = {};

function track(apiKey) {
  usage[apiKey] = (usage[apiKey] || 0) + 1;
}

function getAll() {
  return usage;
}

module.exports = { track, getAll };
