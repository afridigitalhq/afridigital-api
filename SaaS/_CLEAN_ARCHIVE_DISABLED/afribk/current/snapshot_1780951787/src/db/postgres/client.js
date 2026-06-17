const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
  console.warn("⚠️ DB disconnected (running in safe mode):", err.message);
});

module.exports = pool;
