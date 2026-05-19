const { assertApiVersion } = require("../runtime/safety/api.guard");
const users = new Map();

function registerUser(phone) {
  if (!users.has(phone)) {
    users.set(phone, {
      phone,
      registered: true,
      premium: false,
      wallet: 0,
      joinedAt: new Date().toISOString()
    });
  }

  return users.get(phone);
}

function getUser(phone) {
  return users.get(phone);
}

module.exports = {
  registerUser,
  getUser
};
