import test from "node:test";
import assert from "node:assert/strict";
import { AfriAgentArtifactPostgresRepository } from "../AfriAgentArtifactPostgresRepository.js";
import { calculateAfriAgentArtifactHash } from "../AfriAgentArtifactIntegrity.js";

function createPool({ failInsert = false, corruptRead = false } = {}) {
  const parents = new Map();
  const versions = new Map();
  const calls = [];
  const pool = {
    calls,
    async query(sql) {
      calls.push(sql.trim().split(/\s+/).slice(0, 4).join(" "));
      if (sql.includes("SELECT * FROM afri_agent_artifacts")) {
        return { rows: parents.has("ART-TEST-1") ? [parents.get("ART-TEST-1")] : [] };
      }
      if (sql.includes("SELECT * FROM afri_agent_artifact_versions")) {
        const row = versions.get("ART-TEST-1:1");
        if (!row) return { rows: [] };
        return { rows: [corruptRead ? { ...row, content: Buffer.from("tampered") } : row] };
      }
      return { rows: [] };
    },
    async connect() {
      return {
        async query(sql, values = []) {
          calls.push(sql.trim().split(/\s+/).slice(0, 4).join(" "));
          if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") return { rows: [] };
          if (sql.includes("INSERT INTO afri_agent_artifacts")) {
            const [id, owner, workspace, repository, type, created] = values;
            if (!parents.has(id)) {
              parents.set(id, {
                artifact_id: id, owner_id: owner, workspace_id: workspace,
                repository_id: repository, artifact_type: type, created_at: created
              });
            }
            return { rows: [] };
          }
          if (sql.includes("SELECT * FROM afri_agent_artifacts")) {
            return { rows: parents.has(values[0]) ? [parents.get(values[0])] : [] };
          }
          if (sql.includes("SELECT COALESCE(MAX(version)")) {
            const latest = [...versions.values()]
              .filter(row => row.artifact_id === values[0])
              .reduce((max, row) => Math.max(max, row.version), 0);
            return { rows: [{ latest_version: latest }] };
          }
          if (sql.includes("INSERT INTO afri_agent_artifact_versions")) {
            if (failInsert) throw new Error("SIMULATED_INSERT_FAILURE");
            const [id, version, fileName, contentType, size, hash, content, created] = values;
            const row = {
              artifact_id: id, version, file_name: fileName, content_type: contentType,
              size_bytes: size, checksum_sha256: hash, content: Buffer.from(content),
              created_at: created
            };
            versions.set(`${id}:${version}`, row);
            return { rows: [row] };
          }
          throw new Error(`UNEXPECTED_SQL: ${sql}`);
        },
        release() { calls.push("RELEASE"); }
      };
    }
  };
  return pool;
}

const input = overrides => ({
  artifactId: "ART-TEST-1",
  ownerId: "AGENT-AFRIAICODER-001",
  workspaceId: "WORKSPACE-001",
  repositoryId: "afridigital-api",
  artifactType: "CODE_CHANGE_PROPOSAL",
  fileName: "proposal.json",
  contentType: "application/json",
  content: Buffer.from('{"status":"PATCH_PROPOSAL_READY"}'),
  ...overrides
});

test("initializes schema and registers a durable version transactionally", async () => {
  const pool = createPool();
  const repository = new AfriAgentArtifactPostgresRepository({ pool, clock: () => 1000 });
  await repository.initialize();
  const result = await repository.registerVersion(input());

  assert.equal(result.version.version, 1);
  assert.equal(result.artifact.workspaceId, "WORKSPACE-001");
  assert.ok(pool.calls.includes("BEGIN"));
  assert.ok(pool.calls.includes("COMMIT"));
  assert.ok(pool.calls.includes("RELEASE"));
});

test("rejects changes to immutable artifact ownership and scope", async () => {
  const repository = new AfriAgentArtifactPostgresRepository({ pool: createPool() });
  await repository.registerVersion(input());
  await assert.rejects(
    repository.registerVersion(input({ workspaceId: "OTHER-WORKSPACE" })),
    { code: "AFRI_ARTIFACT_IDENTITY_IMMUTABLE" }
  );
});

test("rolls back a failed version insert and releases its connection", async () => {
  const pool = createPool({ failInsert: true });
  const repository = new AfriAgentArtifactPostgresRepository({ pool });
  await assert.rejects(repository.registerVersion(input()), /SIMULATED_INSERT_FAILURE/);
  assert.ok(pool.calls.includes("ROLLBACK"));
  assert.ok(pool.calls.includes("RELEASE"));
  assert.ok(!pool.calls.includes("COMMIT"));
});

test("verifies stored content against its persisted checksum on retrieval", async () => {
  const pool = createPool();
  const repository = new AfriAgentArtifactPostgresRepository({ pool });
  await repository.registerVersion(input());
  const version = await repository.getVersion("ART-TEST-1", 1);
  assert.equal(version.checksumSha256, calculateAfriAgentArtifactHash(version.content));
  assert.deepEqual(version.content, input().content);
});

test("rejects tampered stored content", async () => {
  const pool = createPool({ corruptRead: true });
  const repository = new AfriAgentArtifactPostgresRepository({ pool });
  await repository.registerVersion(input());
  await assert.rejects(
    repository.getVersion("ART-TEST-1", 1),
    { code: "AFRI_ARTIFACT_INTEGRITY_FAILURE" }
  );
});
