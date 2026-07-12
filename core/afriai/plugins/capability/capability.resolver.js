class CapabilityResolver {
  constructor() {
    this.map = new Map();
  }

  register(manifest) {
    (manifest.capabilities || []).forEach(cap => {
      if (!this.map.has(cap)) this.map.set(cap, []);
      this.map.get(cap).push(manifest.id);
    });
  }

  providers(capability) {
    return this.map.get(capability) || [];
  }

  snapshot() {
    return Object.fromEntries(this.map);
  }
}

module.exports = new CapabilityResolver();
