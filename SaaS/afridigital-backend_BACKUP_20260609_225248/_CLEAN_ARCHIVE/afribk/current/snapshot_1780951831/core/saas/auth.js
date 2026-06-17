function validateKey(apiKey) {
  if (!apiKey) return false;
  return apiKey.startsWith("ak_");
}

module.exports = { validateKey };
