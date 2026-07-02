module.exports = function classifyIntent(text = "") {
  text = text.toLowerCase();

  if (text.includes("job")) return "jobs";
  if (text.includes("buy") || text.includes("order")) return "services";
  if (text.includes("match") || text.includes("date")) return "social";
  if (text.includes("earn") || text.includes("survey")) return "tasks";
  if (text.includes("boost")) return "boost";

  return "chat";
};
