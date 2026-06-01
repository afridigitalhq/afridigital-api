module.exports = (req, res) => {
  res.json({
    META_ACCESS_TOKEN: !!config.get("auth.token"),
    META_PHONE_NUMBER_ID: !!config.get("whatsapp.phoneId"),
    META_VERIFY_TOKEN: !!config.get("whatsapp.verifyToken"),
    JWT_SECRET: !!config.get("jwt.secret"),
    REDIS_URL: !!process.env.REDIS_URL,
    WHATSAPP_TOKEN: !!config.get("whatsapp.token")
  });
};
