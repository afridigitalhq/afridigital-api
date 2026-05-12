const { assertApiVersion } = require("../runtime/safety/api.guard");
const { executeAdminCommand } =
require('./admin/admin.commands');

const { executeUserCommand } =
require('./user/user.commands');

require('dotenv').config();

function isAdmin(sender) {

  return sender.includes(
    process.env.AFRI_ADMIN_NUMBER
  );
}

async function executeMessage({
  sender,
  message
}) {

  if (isAdmin(sender)) {

    return executeAdminCommand(
      message
    );
  }

  return executeUserCommand(
    message,
    sender
  );
}

module.exports = {
  executeMessage
};
