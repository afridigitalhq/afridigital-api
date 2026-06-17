function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("hi") || t.includes("hello")) {
    return "greeting";
  }

  if (t.includes("buy") || t.includes("order")) {
    return "purchase";
  }

  if (t.includes("status") || t.includes("check")) {
    return "status_query";
  }

  return "unknown";
}

module.exports = { detectIntent };
