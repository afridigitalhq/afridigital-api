function isAdmin(req) {
  const admin = process.env.AFRI_ADMIN_NUMBER;
  const sender = req.body?.from || req.body?.phone || "";

  return sender.includes(admin);
}

module.exports = { isAdmin };
