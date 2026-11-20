import { AfriREAResearchSourceTypes } from "./AfriREAResearchSchema.js";

const SUPPORTED_TYPES = new Set(AfriREAResearchSourceTypes);

export class AfriREASourceAdapterRegistry {
  constructor() {
    this.adapters = new Map();
  }

  register(type, adapter) {
    if (!SUPPORTED_TYPES.has(type)) {
      throw new Error("AFRIREA_SOURCE_ADAPTER_TYPE_INVALID");
    }
    if (!adapter || typeof adapter.process !== "function") {
      throw new Error("AFRIREA_SOURCE_ADAPTER_INVALID");
    }
    if (this.adapters.has(type)) {
      throw new Error("AFRIREA_SOURCE_ADAPTER_DUPLICATE");
    }
    this.adapters.set(type, adapter);
    return this;
  }

  resolve(type) {
    return this.adapters.get(type) || null;
  }

  has(type) {
    return this.adapters.has(type);
  }

  list() {
    return [...this.adapters.keys()];
  }
}

export default AfriREASourceAdapterRegistry;
