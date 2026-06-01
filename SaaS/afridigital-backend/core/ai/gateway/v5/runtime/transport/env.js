const TOKEN = config.get("auth.token");
const PHONE_ID = config.get("whatsapp.phoneId");
const VERIFY_TOKEN = config.get("whatsapp.verifyToken");

module.exports = {
  TOKEN,
  PHONE_ID,
  VERIFY_TOKEN
};
