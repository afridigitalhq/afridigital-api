class ManifestRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(manifest) {
    if (this.registry.has(manifest.id)) {
      throw new Error(`Duplicate manifest: ${manifest.id}`);
    }
    this.registry.set(manifest.id, manifest);
    return manifest;
  }

  unregister(id) {
    return this.registry.delete(id);
  }

  get(id) {
    return this.registry.get(id);
  }

  list() {
    return [...this.registry.values()];
  }

  count() {
    return this.registry.size;
  }

  clear() {
    this.registry.clear();
  }
}

module.exports = new ManifestRegistry();
