import { ServiceContainer } from "./ServiceContainer.js";
import { ServiceRegistry } from "./ServiceRegistry.js";
import { ServiceFactory } from "./ServiceFactory.js";

export class DependencyContainer {
  constructor() {
    this.container = new ServiceContainer();
    this.registry = new ServiceRegistry();
    this.factory = new ServiceFactory();
  }

  register(name, factory) {
    this.registry.register(name, factory);

    const instance = this.factory.create(() => new factory());

    this.container.register(name, instance);
    return instance;
  }

  resolve(name) {
    return this.container.resolve(name);
  }

  has(name) {
    return this.container.has(name);
  }
}
