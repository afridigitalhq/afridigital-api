const pool = require("../postgres/client");

const dbWriter = {
  async addUser(email, phone) {
    return pool.query(
      "INSERT INTO users(email, phone) VALUES($1,$2) RETURNING *",
      [email, phone]
    );
  },

  async logAudit(type, payload) {
    return pool.query(
      "INSERT INTO audit_logs(type, payload) VALUES($1,$2)",
      [type, payload]
    );
  },

  async saveWhatsAppEvent(messageId, payload) {
    return pool.query(
      "INSERT INTO whatsapp_events(message_id, payload) VALUES($1,$2)",
      [messageId, payload]
    );
  }
};

module.exports = dbWriter;
