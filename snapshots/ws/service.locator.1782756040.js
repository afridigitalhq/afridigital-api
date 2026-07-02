class ServiceLocator {
  constructor() {
    this.services = new Map();
  }

  register(capability, instance) {
    this.services.set(capability, instance);

    return {
      ok: true,
      capability
    };
  }

  resolve(capability) {
    if (!this.services.has(capability)) {
      return {
        ok: false,
        error: "SERVICE_NOT_FOUND",
        capability
      };
    }

    return {
      ok: true,
      capability,
      service: this.services.get(capability)
    };
  }

  list() {
    return [...this.services.keys()];
  }
}

module.exports = new ServiceLocator();
