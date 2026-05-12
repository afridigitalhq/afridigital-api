const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * Lightweight pseudo-embedding engine (no external API dependency)
 * Converts text → numeric vector for similarity matching
 */

function embed(text = "") {
  const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const words = clean.split(" ").filter(Boolean);

  const vector = new Array(64).fill(0);

  words.forEach((word, i) => {
    const index = (word.charCodeAt(0) + word.length + i) % 64;
    vector[index] += 1;
  });

  return vector;
}

module.exports = embed;
