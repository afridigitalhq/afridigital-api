const pool = require("../postgres/client");

async function getAnalytics() {
  const res = await pool.query("SELECT * FROM users");

  const users = res.rows;
  const now = Date.now();

  return {
    total: users.length,
    last15m: users.filter(u => now - new Date(u.created_at).getTime() < 900000).length,
    last1h: users.filter(u => now - new Date(u.created_at).getTime() < 3600000).length,
    last1d: users.filter(u => now - new Date(u.created_at).getTime() < 86400000).length,
    last1w: users.filter(u => now - new Date(u.created_at).getTime() < 604800000).length
  };
}

module.exports = { getAnalytics };
