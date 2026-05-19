const { assertApiVersion } = require("../runtime/safety/api.guard");
require('dotenv').config();

function isAdmin(sender) {
  return sender === process.env.AFRI_ADMIN_NUMBER;
}

function validatePassword(password) {
  return password === process.env.AFRI_ADMIN_PASSWORD;
}

module.exports = { isAdmin, validatePassword };
