export class AfriFixRuntimeRegistry {
  constructor() {
    this.consumers = [
      "afridebug",
      "afriai",
      "afridesign",
      "core",
      "platform"
    ];
  }

  register(moduleName) {
    if (!this.consumers.includes(moduleName)) {
      this.consumers.push(moduleName);
    }
    return this.consumers;
  }

  list() {
    return this.consumers;
  }

  isRegistered(moduleName) {
    return this.consumers.includes(moduleName);
  }
}
