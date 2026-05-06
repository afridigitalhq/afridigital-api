const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userPhone: String,
  message: String,
  response: String,
  channel: { type: String, default: "whatsapp" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
