const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getUser } = require('../users/user.engine');

function requireRegistration(phone) {
  const user = getUser(phone);

  if (!user) {
    return {
      allowed: false,
      message: `
⚠️ You need to register first.

Type:
REGISTER

to unlock AfriDigital Ecosystem.
`
    };
  }

  return {
    allowed: true,
    user
  };
}

module.exports = { requireRegistration };
