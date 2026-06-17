const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema({
  type: String,
  payload: Object,
  ts: { type: Number, default: Date.now }
});

module.exports = mongoose.model("Audit", AuditSchema);
