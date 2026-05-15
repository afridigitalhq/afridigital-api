/**
 * 🐕 A3.18.9 ABUSE LOOP DETECTOR
 * Detects repetitive / spam / bot-like behavior
 */

function detectAbuse(pattern) {

  const score = {
    rapidMessages: pattern.rapidMessages || 0,
    repeatedText: pattern.repeatedText || 0,
    failedAttempts: pattern.failedAttempts || 0
  };

  const risk =
    (score.rapidMessages * 0.4) +
    (score.repeatedText * 0.3) +
    (score.failedAttempts * 0.3);

  return {
    riskScore: risk,
    isAbusive: risk > 0.7
  };
}

module.exports = { detectAbuse };
