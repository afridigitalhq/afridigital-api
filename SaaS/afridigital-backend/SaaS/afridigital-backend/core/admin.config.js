const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 👑 AfriOS Admin Config v2.0 (ENV LOCKED)
 */

function getAdmins() {
  const raw = process.env.ADMIN_PHONE || "";
  
  return raw
    .split(",")
    .map(n => n.trim())
    .filter(Boolean);
}

function isAdmin(number) {
  return getAdmins().includes(number);
}

module.exports = {
  isAdmin,
  getAdmins
};
