const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🧾 AfriOS Proof Intelligence Engine v2.6
 */

function validateProof(proof) {

  let score = 100;

  // 📸 missing images
  if (!proof?.images || proof.images.length === 0) {
    score -= 60;
  }

  // 📝 weak or empty description
  if (!proof?.notes || proof.notes.length < 10) {
    score -= 20;
  }

  // ⚠️ too many images (spam signal)
  if (proof?.images?.length > 10) {
    score -= 10;
  }

  return {
    valid: score >= 60,
    score: Math.max(0, score),
    status:
      score >= 80
        ? "STRONG"
        : score >= 60
        ? "ACCEPTABLE"
        : "WEAK"
  };
}

// 🔁 DUPLICATE DETECTION (simple hash idea)
function detectDuplicate(jobA, jobB) {

  const a = JSON.stringify(jobA);
  const b = JSON.stringify(jobB);

  return a === b;
}

module.exports = {
  validateProof,
  detectDuplicate
};
