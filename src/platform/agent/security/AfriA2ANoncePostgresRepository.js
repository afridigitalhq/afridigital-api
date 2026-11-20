const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS afri_a2a_nonces (
    agent_id TEXT NOT NULL,
    nonce TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    PRIMARY KEY (agent_id, nonce)
  );
  CREATE INDEX IF NOT EXISTS idx_afri_a2a_nonces_expiry
    ON afri_a2a_nonces (expires_at);
`;

export class AfriA2ANoncePostgresRepository {
  constructor({ pool } = {}) {
    if (!pool || typeof pool.query !== "function") {
      throw new Error("AFRI_A2A_NONCE_POSTGRES_POOL_REQUIRED");
    }
    this.pool = pool;
    this.initialization = null;
  }

  async initialize() {
    if (this.initialization) return this.initialization;
    this.initialization = this.pool.query(CREATE_TABLE_SQL).then(() => true);
    try {
      return await this.initialization;
    } catch (error) {
      this.initialization = null;
      throw error;
    }
  }

  async consume({ agentId, nonce, now, expiresAt } = {}) {
    if (
      typeof agentId !== "string" || !agentId.trim() ||
      typeof nonce !== "string" || !nonce.trim() ||
      !Number.isFinite(now) ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= now
    ) {
      throw new Error("AFRI_A2A_NONCE_INPUT_INVALID");
    }

    await this.initialize();
    await this.pool.query(
      "DELETE FROM afri_a2a_nonces WHERE expires_at <= $1",
      [now]
    );

    const result = await this.pool.query(
      `INSERT INTO afri_a2a_nonces (agent_id, nonce, expires_at, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (agent_id, nonce) DO NOTHING
       RETURNING agent_id`,
      [agentId, nonce, expiresAt, now]
    );

    return Array.isArray(result.rows) && result.rows.length === 1;
  }
}

export default AfriA2ANoncePostgresRepository;
