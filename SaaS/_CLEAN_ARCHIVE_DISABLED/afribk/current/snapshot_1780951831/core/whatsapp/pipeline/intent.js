module.exports = function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi")) return "greet";
  if (t.includes("status")) return "system_status";
  if (t.includes("deploy")) return "deploy_check";

  return "unknown";
};
