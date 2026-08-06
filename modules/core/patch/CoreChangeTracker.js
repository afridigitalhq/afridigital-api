const CoreChangeTracker = {
  track(change = {}) {
    return {
      id: `CHG-${Date.now()}`,
      service: change.service || "Unknown",
      change,
      timestamp: new Date().toISOString(),
      status: "TRACKED"
    };
  }
};

export default CoreChangeTracker;
