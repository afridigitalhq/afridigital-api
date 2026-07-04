export class AfriMonitorModuleRegistry {
  constructor() {
    this.modules = new Map();
  }

  register(name, module) {
    this.modules.set(name, module);
  }

  get(name) {
    return this.modules.get(name);
  }

  getAll() {
    return Object.fromEntries(this.modules);
  }
}
