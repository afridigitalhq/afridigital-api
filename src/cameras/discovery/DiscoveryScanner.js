import { discoveryModules } from "./modules/index.js";

export class DiscoveryScanner {
  constructor(modules = discoveryModules) {
    this.modules = modules;
  }

  async scan(options = {}) {
    const results = [];

    for (const module of this.modules) {
      if (module?.scan) {
        const data = await module.scan(options);
        if (Array.isArray(data)) {
          results.push(...data);
        }
      }
    }

    return results;
  }
}
