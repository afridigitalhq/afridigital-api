const { assertApiVersion } = require("../runtime/safety/api.guard");
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (!magA || !magB) return 0;

  return dot / (magA * magB);
}

module.exports = cosineSimilarity;
