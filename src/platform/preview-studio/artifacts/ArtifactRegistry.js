import { randomUUID } from "node:crypto";

const MEDIA_TYPES = new Set([
  "IMAGE",
  "VIDEO",
  "WEBSITE",
  "APP",
  "DOCUMENT",
  "OTHER"
]);

function fail(code) {
  throw new Error(code);
}

function validText(value, maxLength = 255) {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength;
}

function validateDependencies(repository, storageProvider) {
  if (
    !repository ||
    typeof repository.get !== "function" ||
    typeof repository.save !== "function"
  ) {
    fail("AFRI_ARTIFACT_REPOSITORY_INVALID");
  }

  if (
    !storageProvider ||
    typeof storageProvider.put !== "function" ||
    typeof storageProvider.delete !== "function"
  ) {
    fail("AFRI_ARTIFACT_STORAGE_PROVIDER_INVALID");
  }
}

export class ArtifactRegistry {
  constructor({ repository, storageProvider } = {}) {
    validateDependencies(repository, storageProvider);
    this.repository = repository;
    this.storageProvider = storageProvider;
  }

  async registerVersion(input = {}) {
    if (!validText(input.ownerId, 128)) {
      fail("AFRI_ARTIFACT_OWNER_INVALID");
    }

    if (!MEDIA_TYPES.has(input.mediaType)) {
      fail("AFRI_ARTIFACT_MEDIA_TYPE_INVALID");
    }

    if (
      !validText(input.fileName) ||
      input.fileName.includes("/") ||
      input.fileName.includes("\\")
    ) {
      fail("AFRI_ARTIFACT_FILENAME_INVALID");
    }

    if (!validText(input.contentType, 160)) {
      fail("AFRI_ARTIFACT_CONTENT_TYPE_INVALID");
    }

    if (
      !Number.isSafeInteger(input.sizeBytes) ||
      input.sizeBytes < 1
    ) {
      fail("AFRI_ARTIFACT_SIZE_INVALID");
    }

    if (
      typeof input.checksumSha256 !== "string" ||
      !/^[a-f0-9]{64}$/i.test(input.checksumSha256)
    ) {
      fail("AFRI_ARTIFACT_CHECKSUM_INVALID");
    }

    if (input.source === undefined || input.source === null) {
      fail("AFRI_ARTIFACT_SOURCE_REQUIRED");
    }

    const artifactId = input.artifactId || `ART-${randomUUID()}`;

    if (
      typeof artifactId !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(artifactId)
    ) {
      fail("AFRI_ARTIFACT_ID_INVALID");
    }

    const existing = await this.repository.get(artifactId);

    if (existing && existing.ownerId !== input.ownerId) {
      fail("AFRI_ARTIFACT_OWNER_MISMATCH");
    }

    if (existing && existing.mediaType !== input.mediaType) {
      fail("AFRI_ARTIFACT_MEDIA_TYPE_IMMUTABLE");
    }

    const version = existing ? existing.versions.length + 1 : 1;
    const checksum = input.checksumSha256.toLowerCase();
    const objectKey = `${artifactId}/v${version}/${checksum}`;

    const storageRef = await this.storageProvider.put({
      key: objectKey,
      source: input.source,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
      checksumSha256: checksum
    });

    if (
      !storageRef ||
      !validText(storageRef.provider, 80) ||
      storageRef.objectKey !== objectKey
    ) {
      try {
        await this.storageProvider.delete({ key: objectKey });
      } catch {
        // Preserve the original storage-reference validation error.
      }

      fail("AFRI_ARTIFACT_STORAGE_REFERENCE_INVALID");
    }

    const versionRecord = {
      version,
      fileName: input.fileName,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
      checksumSha256: checksum,
      storageRef: {
        provider: storageRef.provider,
        objectKey: storageRef.objectKey
      },
      createdAt: new Date().toISOString()
    };

    const record = {
      artifactId,
      ownerId: input.ownerId,
      mediaType: input.mediaType,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: versionRecord.createdAt,
      versions: [
        ...(existing?.versions || []),
        versionRecord
      ]
    };

    try {
      await this.repository.save(record);
    } catch (error) {
      try {
        await this.storageProvider.delete({ key: objectKey });
      } catch {
        // Preserve the metadata persistence failure.
      }

      throw error;
    }

    return structuredClone(record);
  }

  async get(artifactId) {
    if (!validText(artifactId, 128)) {
      fail("AFRI_ARTIFACT_ID_INVALID");
    }

    const record = await this.repository.get(artifactId);
    return record ? structuredClone(record) : null;
  }
}

export default ArtifactRegistry;
