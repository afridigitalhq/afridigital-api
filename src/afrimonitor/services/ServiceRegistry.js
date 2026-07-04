export class ServiceRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(name, factory) {
    this.registry.set(name, factory);
    return factory;
  }

  get(name) {
    return this.registry.get(name);
  }

  has(name) {
    return this.registry.has(name);
  }

  entries() {
    return [...this.registry.entries()];
  }
}
