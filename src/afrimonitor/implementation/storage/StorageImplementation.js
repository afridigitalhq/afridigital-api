export class StorageImplementation {
  constructor() {
    this.name = "StorageImplementation";
    this.store = new Map();
  }

  save(key, value) {
    this.store.set(key, value);
    return { ok: true };
  }

  get(key) {
    return this.store.get(key);
  }

  delete(key) {
    return this.store.delete(key);
  }

  list() {
    return [...this.store.entries()];
  }
}
