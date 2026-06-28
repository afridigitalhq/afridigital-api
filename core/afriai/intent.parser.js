function parseIntent(input = "") {
  const text = input.toLowerCase();

  if (text.includes("deploy") || text.includes("release")) return "DEPLOY";
  if (text.includes("event")) return "EVENT_QUERY";
  if (text.includes("whatsapp")) return "WHATSAPP_QUERY";
  if (text.includes("status") || text.includes("health")) return "SYSTEM_STATUS";
  if (text.includes("topology")) return "TOPOLOGY_VIEW";

  return "GENERAL_CHAT";
}

module.exports = { parseIntent };
