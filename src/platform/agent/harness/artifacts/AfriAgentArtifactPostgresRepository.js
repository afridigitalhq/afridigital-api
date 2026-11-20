import { validateAfriAgentArtifactInput } from "./AfriAgentArtifactContract.js";
import { verifyAfriAgentArtifactHash } from "./AfriAgentArtifactIntegrity.js";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS afri_agent_artifacts (
  artifact_id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  repository_id TEXT NOT NULL,
  artifact_type TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  UNIQUE (artifact_id, owner_id)
);
CREATE TABLE IF NOT EXISTS afri_agent_artifact_versions (
  artifact_id TEXT NOT NULL REFERENCES afri_agent_artifacts(artifact_id) ON DELETE RESTRICT,
  version INTEGER NOT NULL CHECK (version > 0),
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes BETWEEN 1 AND 131072),
  checksum_sha256 CHAR(64) NOT NULL CHECK (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  content BYTEA NOT NULL CHECK (octet_length(content) BETWEEN 1 AND 131072),
  created_at BIGINT NOT NULL,
  PRIMARY KEY (artifact_id, version),
  CHECK (size_bytes = octet_length(content))
);
CREATE INDEX IF NOT EXISTS idx_afri_agent_artifact_versions_created
  ON afri_agent_artifact_versions (artifact_id, created_at DESC);

CREATE OR REPLACE FUNCTION afri_reject_artifact_mutation() RETURNS trigger AS $afri$
BEGIN
  RAISE EXCEPTION USING MESSAGE = 'AFRI_ARTIFACT_IMMUTABLE: ' || TG_TABLE_NAME;
END;
$afri$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_afri_agent_artifacts_immutable ON afri_agent_artifacts;
CREATE TRIGGER trg_afri_agent_artifacts_immutable
  BEFORE UPDATE OR DELETE ON afri_agent_artifacts
  FOR EACH ROW EXECUTE FUNCTION afri_reject_artifact_mutation();
DROP TRIGGER IF EXISTS trg_afri_agent_artifact_versions_immutable ON afri_agent_artifact_versions;
CREATE TRIGGER trg_afri_agent_artifact_versions_immutable
  BEFORE UPDATE OR DELETE ON afri_agent_artifact_versions
  FOR EACH ROW EXECUTE FUNCTION afri_reject_artifact_mutation();
`;

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function mapArtifact(row) {
  if (!row) return null;
  return Object.freeze({
    artifactId: row.artifact_id,
    ownerId: row.owner_id,
    workspaceId: row.workspace_id,
    repositoryId: row.repository_id,
    artifactType: row.artifact_type,
    createdAt: Number(row.created_at)
  });
}

function mapVersion(row, includeContent = false) {
  if (!row) return null;
  const result = {
    artifactId: row.artifact_id,
    version: Number(row.version),
    fileName: row.file_name,
    contentType: row.content_type,
    sizeBytes: Number(row.size_bytes),
    checksumSha256: row.checksum_sha256.trim(),
    createdAt: Number(row.created_at)
  };
  if (includeContent) result.content = Buffer.from(row.content);
  return Object.freeze(result);
}

export class AfriAgentArtifactPostgresRepository {
  constructor({ pool, clock = Date.now } = {}) {
    if (!pool || typeof pool.query !== "function" || typeof pool.connect !== "function") {
      fail("AFRI_ARTIFACT_POSTGRES_POOL_REQUIRED");
    }
    if (typeof clock !== "function") fail("AFRI_ARTIFACT_CLOCK_INVALID");
    this.pool = pool;
    this.clock = clock;
    this.initialization = null;
  }

  async initialize() {
    if (!this.initialization) {
      this.initialization = this.pool.query(SCHEMA).then(() => true).catch(error => {
        this.initialization = null;
        throw error;
      });
    }
    return this.initialization;
  }

  async registerVersion(input = {}) {
    const artifact = validateAfriAgentArtifactInput(input);
    const client = await this.pool.connect();
    let inTransaction = false;

    try {
      await client.query("BEGIN");
      inTransaction = true;

      await client.query(
        `INSERT INTO afri_agent_artifacts
         (artifact_id, owner_id, workspace_id, repository_id, artifact_type, created_at)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (artifact_id) DO NOTHING`,
        [
          artifact.artifactId, artifact.ownerId, artifact.workspaceId,
          artifact.repositoryId, artifact.artifactType, this.clock()
        ]
      );

      const parentResult = await client.query(
        `SELECT * FROM afri_agent_artifacts
         WHERE artifact_id = $1 FOR UPDATE`,
        [artifact.artifactId]
      );
      const parent = parentResult.rows?.[0];
      if (!parent) fail("AFRI_ARTIFACT_PARENT_NOT_FOUND");

      if (
        parent.owner_id !== artifact.ownerId ||
        parent.workspace_id !== artifact.workspaceId ||
        parent.repository_id !== artifact.repositoryId ||
        parent.artifact_type !== artifact.artifactType
      ) {
        fail("AFRI_ARTIFACT_IDENTITY_IMMUTABLE");
      }

      const versionResult = await client.query(
        `SELECT COALESCE(MAX(version), 0) AS latest_version
         FROM afri_agent_artifact_versions
         WHERE artifact_id = $1`,
        [artifact.artifactId]
      );
      const version = Number(versionResult.rows?.[0]?.latest_version ?? 0) + 1;
      if (!Number.isSafeInteger(version) || version < 1) {
        fail("AFRI_ARTIFACT_VERSION_INVALID");
      }

      const createdAt = this.clock();
      const inserted = await client.query(
        `INSERT INTO afri_agent_artifact_versions
         (artifact_id, version, file_name, content_type, size_bytes,
          checksum_sha256, content, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [
          artifact.artifactId, version, artifact.fileName,
          artifact.contentType, artifact.sizeBytes,
          artifact.checksumSha256, artifact.content, createdAt
        ]
      );

      await client.query("COMMIT");
      inTransaction = false;

      return Object.freeze({
        artifact: mapArtifact(parent),
        version: mapVersion(inserted.rows?.[0])
      });
    } catch (error) {
      if (inTransaction) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // Preserve the original failure.
        }
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async getArtifact(artifactId) {
    if (typeof artifactId !== "string" || !artifactId.trim()) {
      fail("AFRI_ARTIFACT_ID_INVALID");
    }
    const result = await this.pool.query(
      "SELECT * FROM afri_agent_artifacts WHERE artifact_id = $1",
      [artifactId.trim()]
    );
    return mapArtifact(result.rows?.[0]);
  }

  async getVersion(artifactId, version) {
    if (
      typeof artifactId !== "string" || !artifactId.trim() ||
      !Number.isSafeInteger(version) || version < 1
    ) fail("AFRI_ARTIFACT_VERSION_LOOKUP_INVALID");

    const result = await this.pool.query(
      `SELECT * FROM afri_agent_artifact_versions
       WHERE artifact_id = $1 AND version = $2`,
      [artifactId.trim(), version]
    );
    const row = result.rows?.[0];
    if (!row) return null;

    if (!verifyAfriAgentArtifactHash(row.content, row.checksum_sha256.trim())) {
      fail("AFRI_ARTIFACT_INTEGRITY_FAILURE");
    }
    if (Number(row.size_bytes) !== Buffer.byteLength(row.content)) {
      fail("AFRI_ARTIFACT_SIZE_INTEGRITY_FAILURE");
    }
    return mapVersion(row, true);
  }

  async getLatestVersion(artifactId) {
    if (typeof artifactId !== "string" || !artifactId.trim()) {
      fail("AFRI_ARTIFACT_ID_INVALID");
    }
    const result = await this.pool.query(
      `SELECT * FROM afri_agent_artifact_versions
       WHERE artifact_id = $1 ORDER BY version DESC LIMIT 1`,
      [artifactId.trim()]
    );
    const row = result.rows?.[0];
    if (!row) return null;

    if (!verifyAfriAgentArtifactHash(row.content, row.checksum_sha256.trim())) {
      fail("AFRI_ARTIFACT_INTEGRITY_FAILURE");
    }
    if (Number(row.size_bytes) !== Buffer.byteLength(row.content)) {
      fail("AFRI_ARTIFACT_SIZE_INTEGRITY_FAILURE");
    }
    return mapVersion(row, true);
  }
}

export default AfriAgentArtifactPostgresRepository;
