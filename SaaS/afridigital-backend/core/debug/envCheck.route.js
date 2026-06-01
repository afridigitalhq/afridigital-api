module.exports = (req, res) => {
  res.json({
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID,
    META_VERIFY_TOKEN: !!process.env.META_VERIFY_TOKEN,
    JWT_SECRET: !!process.env.JWT_SECRET,
    REDIS_URL: !!process.env.REDIS_URL,
    WHATSAPP_TOKEN: !!process.env.WHATSAPP_TOKEN
  });
};
