const SOURCES = new Set(["WEB","IMAGES","DOCUMENTS","REPOSITORIES","APIS","PROFILES","DOMAINS","APPLICATIONS"]);

const AfriIntelQueryPlanner = {
  plan(input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("AFRI_INTEL_QUERY_INVALID");
    }
    const query = String(input.query ?? input.objective ?? "").trim();
    if (!query) throw new Error("AFRI_INTEL_QUERY_REQUIRED");
    if (query.length > 500) throw new Error("AFRI_INTEL_QUERY_TOO_LONG");

    const requested = Array.isArray(input.sources) && input.sources.length
      ? input.sources.map(value => String(value).toUpperCase())
      : ["WEB"];

    if (requested.some(source => !SOURCES.has(source))) {
      throw new Error("AFRI_INTEL_SOURCE_UNSUPPORTED");
    }

    const limit = input.limit === undefined ? 10 : input.limit;
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      throw new Error("AFRI_INTEL_LIMIT_INVALID");
    }

    return Object.freeze({
      query,
      sources: Object.freeze([...new Set(requested)]),
      limit
    });
  }
};

export default AfriIntelQueryPlanner;
