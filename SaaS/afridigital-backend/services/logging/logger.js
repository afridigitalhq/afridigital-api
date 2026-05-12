const { assertApiVersion } = require("../runtime/safety/api.guard");
const Message = require("../../database/schemas/Message");

async function logMessage(data) {
  try {
    await Message.create(data);
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

module.exports = logMessage;
