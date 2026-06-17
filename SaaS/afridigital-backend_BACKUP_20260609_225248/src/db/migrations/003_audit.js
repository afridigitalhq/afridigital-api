module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        type TEXT,
        payload JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
};
