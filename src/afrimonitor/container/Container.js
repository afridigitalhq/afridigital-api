export class Container {
  constructor() {
    this.services = new Map();
  }

  register(name, instance) {
    this.services.set(name, instance);
    return instance;
  }

  resolve(name) {
    return this.services.get(name);
  }

  has(name) {
    return this.services.has(name);
  }

  remove(name) {
    return this.services.delete(name);
  }

  clear() {
    this.services.clear();
  }
}
