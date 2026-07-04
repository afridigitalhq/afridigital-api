export class ModuleLifecycle {
  constructor() {
    this.started = false;
  }

  start() {
    this.started = true;
    return this.started;
  }

  stop() {
    this.started = false;
    return this.started;
  }

  status() {
    return this.started;
  }
}
