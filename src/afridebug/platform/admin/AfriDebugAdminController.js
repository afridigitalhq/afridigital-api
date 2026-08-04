const AfriDebugAdminController = {

  overview() {

    return {
      service: "AfriDebug",
      status: "active",
      modules: [
        "developers",
        "projects",
        "repositories",
        "billing",
        "api-keys"
      ],
      timestamp: Date.now()
    };

  }

};

export default AfriDebugAdminController;
