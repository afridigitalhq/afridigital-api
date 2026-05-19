const { assertApiVersion } = require("../runtime/safety/api.guard");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "afri_admin_123";

// 🔐 VERIFY ADMIN
function isAdmin(req) {
  const token = req.headers["x-admin-token"];
  return token && token === ADMIN_TOKEN;
}

// 🧍 BASIC USER IDENTIFIER (WhatsApp-based)
function getUserId(req) {
  return req.params.id || req.query.user || "guest";
}

module.exports = {
  isAdmin,
  getUserId
};
