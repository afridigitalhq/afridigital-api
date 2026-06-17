const pool = require("../../db/postgres/client");

module.exports = async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const logs = await pool.query("SELECT COUNT(*) FROM audit_logs");

  res.json({
    totalUsers: users.rows[0].count,
    totalLogs: logs.rows[0].count
  });
};
