import { ContainerBuilder } from "../container/ContainerBuilder.js";

export class ServiceContainer {
  constructor() {
    this.container = new ContainerBuilder().build();
  }

  register(name, service) {
    return this.container.register(name, service);
  }

  resolve(name) {
    return this.container.resolve(name);
  }

  has(name) {
    return this.container.has(name);
  }
}
