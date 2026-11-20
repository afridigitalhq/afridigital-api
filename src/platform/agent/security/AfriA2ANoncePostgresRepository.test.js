import test from "node:test";
import assert from "node:assert/strict";
import { AfriA2ANoncePostgresRepository } from "./AfriA2ANoncePostgresRepository.js";

function createPool() {
  const calls = [];
  return {
    calls,
    pool: {
      async query(sql, values = []) {
        calls.push({ sql, values });
        if (/INSERT INTO afri_a2a_nonces/.test(sql)) {
          return { rows: [{ agent_id: values[0] }] };
        }
        return { rows: [] };
      }
    }
  };
}

test("requires an injected PostgreSQL pool", () => {
  assert.throws(
    () => new AfriA2ANoncePostgresRepository(),
    { message: "AFRI_A2A_NONCE_POSTGRES_POOL_REQUIRED" }
  );
});

test("initializes the nonce table and expiry index once", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriA2ANoncePostgresRepository({ pool });
  await repository.initialize();
  await repository.initialize();
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /CREATE TABLE IF NOT EXISTS afri_a2a_nonces/);
  assert.match(calls[0].sql, /PRIMARY KEY \(agent_id, nonce\)/);
  assert.match(calls[0].sql, /idx_afri_a2a_nonces_expiry/);
});

test("retries schema initialization after a database error", async () => {
  let attempts = 0;
  const pool = {
    async query() {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary database failure");
      return { rows: [] };
    }
  };
  const repository = new AfriA2ANoncePostgresRepository({ pool });
  await assert.rejects(repository.initialize(), /temporary database failure/);
  assert.equal(await repository.initialize(), true);
  assert.equal(attempts, 2);
});

test("consumes a nonce using atomic insertion and expiry cleanup", async () => {
  const { pool, calls } = createPool();
  const repository = new AfriA2ANoncePostgresRepository({ pool });
  assert.equal(await repository.consume({
    agentId: "AGENT-BETA-001",
    nonce: "nonce-1",
    now: 1000,
    expiresAt: 301000
  }), true);

  assert.match(calls[1].sql, /DELETE FROM afri_a2a_nonces WHERE expires_at <= \$1/);
  assert.match(calls[2].sql, /ON CONFLICT \(agent_id, nonce\) DO NOTHING/);
  assert.deepEqual(calls[2].values, ["AGENT-BETA-001", "nonce-1", 301000, 1000]);
});

test("returns false when the nonce already exists", async () => {
  const { pool } = createPool();
  pool.query = async sql => (
    /INSERT INTO afri_a2a_nonces/.test(sql) ? { rows: [] } : { rows: [] }
  );
  const repository = new AfriA2ANoncePostgresRepository({ pool });
  assert.equal(await repository.consume({
    agentId: "AGENT-BETA-001",
    nonce: "duplicate",
    now: 1000,
    expiresAt: 301000
  }), false);
});

test("rejects invalid nonce input", async () => {
  const { pool } = createPool();
  const repository = new AfriA2ANoncePostgresRepository({ pool });
  await assert.rejects(
    repository.consume({ agentId: "", nonce: "n", now: 1, expiresAt: 2 }),
    { message: "AFRI_A2A_NONCE_INPUT_INVALID" }
  );
});
