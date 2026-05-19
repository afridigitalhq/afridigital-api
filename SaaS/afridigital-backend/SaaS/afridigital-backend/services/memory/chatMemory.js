const { assertApiVersion } = require("../runtime/safety/api.guard");
const Message = require("../../database/schemas/Message");

async function saveMemory({ phone, message, response }) {
  try {
    await Message.create({
      userPhone: phone,
      message,
      response,
      channel: "memory"
    });
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

async function getRecentMemory(phone, limit = 5) {
  try {
    return await Message.find({ userPhone: phone })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (err) {
    return [];
  }
}

module.exports = {
  saveMemory,
  getRecentMemory
};
