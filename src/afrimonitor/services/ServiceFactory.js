export class ServiceFactory {
  create(factory, ...args) {
    if (typeof factory !== "function") {
      throw new TypeError("Service factory must be a function");
    }

    return factory(...args);
  }
}
