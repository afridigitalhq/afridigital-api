function score(text, keywords) {
  return keywords.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0);
}

module.exports = function intentAI(text = "") {
  const t = text.toLowerCase();

  const intents = [
    { name: "greeting", keys: ["hi", "hello", "hey"] },
    { name: "system_query", keys: ["status", "system", "health"] },
    { name: "flow_request", keys: ["flow", "process", "run"] },
    { name: "unknown", keys: [] }
  ];

  let best = { name: "unknown", score: 0 };

  for (const i of intents) {
    const s = score(t, i.keys);
    if (s > best.score) best = { name: i.name, score: s };
  }

  return {
    primary: best.name,
    confidence: best.score > 0 ? 0.8 : 0.3
  };
};
