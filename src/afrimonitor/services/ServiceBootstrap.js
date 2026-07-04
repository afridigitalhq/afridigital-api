import { DependencyContainer } from "./DependencyContainer.js";

export class ServiceBootstrap {
  bootstrap() {
    return new DependencyContainer();
  }
}
