const pool = require("../postgres/client");

async function createUser({ email, phone }) {
  const res = await pool.query(
    "INSERT INTO users(email, phone, created_at) VALUES($1,$2, NOW()) RETURNING *",
    [email, phone]
  );
  return res.rows[0];
}

async function getAllUsers() {
  const res = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
  return res.rows;
}

module.exports = { createUser, getAllUsers };
