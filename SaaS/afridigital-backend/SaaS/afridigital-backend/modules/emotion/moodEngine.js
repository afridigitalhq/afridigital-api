const moodDB = new Map();

/**
 * Very lightweight sentiment inference (no external dependency)
 */
function detectMood(text) {
  const t = text.toLowerCase();

  const positive = ["good", "great", "awesome", "thanks", "love", "perfect", "nice"];
  const negative = ["bad", "angry", "hate", "annoyed", "frustrated", "broken", "error"];
  const urgent = ["urgent", "asap", "now", "quick", "fast"];

  let score = 0;

  positive.forEach(w => { if (t.includes(w)) score += 1; });
  negative.forEach(w => { if (t.includes(w)) score -= 2; });
  urgent.forEach(w => { if (t.includes(w)) score -= 0.5; });

  if (score > 1) return "positive";
  if (score < -1) return "negative";
  if (t.includes("urgent")) return "anxious";

  return "neutral";
}

/**
 * Update emotional memory curve
 */
function updateMood(userId, message) {
  if (!moodDB.has(userId)) {
    moodDB.set(userId, {
      history: [],
      current: "neutral",
      stability: 0
    });
  }

  const record = moodDB.get(userId);
  const mood = detectMood(message);

  record.history.push({ mood, ts: Date.now() });

  if (record.history.length > 30) {
    record.history.shift();
  }

  // simple smoothing logic (emotional stability)
  const last3 = record.history.slice(-3).map(m => m.mood);

  if (last3.filter(m => m === mood).length >= 2) {
    record.current = mood;
  }

  record.stability = record.history.filter(h => h.mood === record.current).length;

  moodDB.set(userId, record);
  return record;
}

/**
 * Inject emotional context into AI
 */
function applyMoodContext(userId, prompt) {
  const record = moodDB.get(userId);

  if (!record) return prompt;

  const moodLine = `User emotional state: ${record.current} (stability:${record.stability})\n`;

  return moodLine + "User message: " + prompt;
}

module.exports = { updateMood, applyMoodContext };
