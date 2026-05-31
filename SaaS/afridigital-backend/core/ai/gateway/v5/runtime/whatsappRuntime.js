module.exports = {
  mode: process.env.WHATSAPP_MODE || "mock",
  token: process.env.WHATSAPP_TOKEN || "",
  phoneId: process.env.WHATSAPP_PHONE_ID || ""
};
