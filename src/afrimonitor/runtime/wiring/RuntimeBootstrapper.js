import { ServiceBootstrap } from "../../services/ServiceBootstrap.js";
import { ModuleLifecycle } from "./../wiring/LifecycleBootstrapper.js";
import { AfriMonitorModuleRegistry } from "./../../registry/AfriMonitorModuleRegistry.js";

export class RuntimeBootstrapper {
  constructor() {
    this.serviceBootstrap = new ServiceBootstrap();
    this.lifecycle = new ModuleLifecycle();
    this.registry = new AfriMonitorModuleRegistry();
    this.container = null;
  }

  initializeContainer() {
    this.container = this.serviceBootstrap.bootstrap();
    return this.container;
  }

  loadModules() {
    const modules = this.registry.getAll ? this.registry.getAll() : {};
    return modules;
  }

  start() {
    this.lifecycle.start();
  }

  stop() {
    this.lifecycle.stop();
  }

  boot() {
    this.initializeContainer();
    this.loadModules();
    this.start();
    return this.container;
  }
}
