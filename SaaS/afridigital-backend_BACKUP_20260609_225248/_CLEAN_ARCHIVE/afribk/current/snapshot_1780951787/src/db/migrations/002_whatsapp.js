module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_identities (
        id SERIAL PRIMARY KEY,
        user_id INT,
        whatsapp_id TEXT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
};
