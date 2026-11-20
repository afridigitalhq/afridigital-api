export class ArtifactStorageProvider {
  async put() {
    throw new Error("AFRI_ARTIFACT_STORAGE_PUT_NOT_IMPLEMENTED");
  }

  async get() {
    throw new Error("AFRI_ARTIFACT_STORAGE_GET_NOT_IMPLEMENTED");
  }

  async delete() {
    throw new Error("AFRI_ARTIFACT_STORAGE_DELETE_NOT_IMPLEMENTED");
  }
}

export default ArtifactStorageProvider;
