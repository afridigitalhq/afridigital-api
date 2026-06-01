module.exports = {
  mode: config.get("whatsapp.mode") || "mock",
  token: config.get("whatsapp.token") || "",
  phoneId: config.get("whatsapp.phoneId") || ""
};
