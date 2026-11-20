import test from "node:test";
import assert from "node:assert/strict";
import ArtifactRegistry from "./ArtifactRegistry.js";

function createFixture(options = {}) {
  const records = new Map();
  const stored = new Map();
  const deleted = [];

  const repository = {
    async get(id) {
      const record = records.get(id);
      return record ? structuredClone(record) : null;
    },
    async save(record) {
      if (options.failSave) {
        throw new Error("TEST_METADATA_SAVE_FAILED");
      }
      records.set(record.artifactId, structuredClone(record));
      return record;
    }
  };

  const storageProvider = {
    async put(input) {
      stored.set(input.key, input.source);
      return {
        provider: "TEST_STORAGE",
        objectKey: input.key
      };
    },
    async delete({ key }) {
      deleted.push(key);
      stored.delete(key);
    }
  };

  return {
    registry: new ArtifactRegistry({ repository, storageProvider }),
    records,
    stored,
    deleted
  };
}

function validInput(overrides = {}) {
  return {
    artifactId: "ART-TEST-001",
    ownerId: "AGENT-TEST-001",
    mediaType: "IMAGE",
    fileName: "preview.png",
    contentType: "image/png",
    sizeBytes: 128,
    checksumSha256: "a".repeat(64),
    source: Buffer.from("test-image"),
    ...overrides
  };
}

test("registers the first immutable artifact version", async () => {
  const { registry } = createFixture();
  const result = await registry.registerVersion(validInput());

  assert.equal(result.artifactId, "ART-TEST-001");
  assert.equal(result.versions.length, 1);
  assert.equal(result.versions[0].version, 1);
  assert.equal(result.versions[0].storageRef.provider, "TEST_STORAGE");
});

test("creates a new version without replacing the previous version", async () => {
  const { registry } = createFixture();

  await registry.registerVersion(validInput());

  const result = await registry.registerVersion(validInput({
    fileName: "preview-v2.png",
    checksumSha256: "b".repeat(64)
  }));

  assert.equal(result.versions.length, 2);
  assert.equal(result.versions[0].version, 1);
  assert.equal(result.versions[1].version, 2);
  assert.equal(result.versions[0].checksumSha256, "a".repeat(64));
});

test("prevents another owner from adding an artifact version", async () => {
  const { registry } = createFixture();

  await registry.registerVersion(validInput());

  await assert.rejects(
    registry.registerVersion(validInput({
      ownerId: "AGENT-OTHER-001"
    })),
    { message: "AFRI_ARTIFACT_OWNER_MISMATCH" }
  );
});

test("prevents changing the media type of an existing artifact", async () => {
  const { registry } = createFixture();

  await registry.registerVersion(validInput());

  await assert.rejects(
    registry.registerVersion(validInput({
      mediaType: "VIDEO"
    })),
    { message: "AFRI_ARTIFACT_MEDIA_TYPE_IMMUTABLE" }
  );
});

test("rejects invalid checksums before storage is called", async () => {
  const { registry, stored } = createFixture();

  await assert.rejects(
    registry.registerVersion(validInput({
      checksumSha256: "invalid"
    })),
    { message: "AFRI_ARTIFACT_CHECKSUM_INVALID" }
  );

  assert.equal(stored.size, 0);
});

test("removes uploaded data when metadata persistence fails", async () => {
  const { registry, stored, deleted } = createFixture({
    failSave: true
  });

  await assert.rejects(
    registry.registerVersion(validInput()),
    { message: "TEST_METADATA_SAVE_FAILED" }
  );

  assert.equal(stored.size, 0);
  assert.deepEqual(deleted, [
    `ART-TEST-001/v1/${"a".repeat(64)}`
  ]);
});

test("returns an isolated artifact record", async () => {
  const { registry } = createFixture();

  await registry.registerVersion(validInput());

  const result = await registry.get("ART-TEST-001");
  result.versions[0].fileName = "tampered.png";

  const storedRecord = await registry.get("ART-TEST-001");
  assert.equal(storedRecord.versions[0].fileName, "preview.png");
});

test("returns null for an unknown artifact", async () => {
  const { registry } = createFixture();
  assert.equal(await registry.get("ART-UNKNOWN-001"), null);
});
