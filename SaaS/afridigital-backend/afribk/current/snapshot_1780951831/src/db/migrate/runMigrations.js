const fs = require("fs");
const path = require("path");
const pool = require("../postgres/client");

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      run_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const files = fs.readdirSync(path.join(__dirname, "../migrations"));

  for (const file of files) {
    const exists = await pool.query(
      "SELECT 1 FROM migrations WHERE name=$1",
      [file]
    );

    if (exists.rowCount > 0) continue;

    console.log("➡️ Running migration:", file);

    const migration = require("../migrations/" + file);
    await migration.up(pool);

    await pool.query(
      "INSERT INTO migrations(name) VALUES($1)",
      [file]
    );

    console.log("✅ Migration complete:", file);
  }

  console.log("🟢 All migrations applied safely");
}

module.exports = { runMigrations };
