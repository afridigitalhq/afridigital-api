async function route(intent) {
  // placeholder for OpenAI/local model routing
  // DO NOT execute directly — only enrich intent

  if (intent.type === "UNKNOWN") {
    return {
      ...intent,
      enriched: false,
      suggestion: "No match found"
    };
  }

  return {
    ...intent,
    enriched: true
  };
}

module.exports = { route };
