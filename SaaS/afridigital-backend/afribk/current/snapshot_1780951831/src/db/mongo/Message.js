const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  type: String,
  payload: Object,
  ts: { type: Number, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
