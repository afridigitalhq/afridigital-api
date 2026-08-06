import Registry from "../admin/AfriDebugAdminRegistry.js";

const AfriDebugAdminRuntime = {
  start() {
    return {
      status: "online",
      startedAt: Date.now(),
      modules: Registry.list()
    };
  },

  health() {
    return {
      service: "AfriDebugAdmin",
      status: "healthy",
      modules: Registry.list().length
    };
  },

  module(name) {
    return Registry.get(name);
  }
};

export default AfriDebugAdminRuntime;
