const USERS = {
  "whatsapp:+1000": { role: "SUPERADMIN" },
  "whatsapp:+2000": { role: "ADMIN" },
  "whatsapp:+3000": { role: "USER" }
};

function getUser(id) {
  return USERS[id] || { role: "USER" };
}

module.exports = { getUser };
