import AfriIntelQueryPlanner from "./AfriIntelQueryPlanner.js";

function normalizeEvidence(item, adapter, sourceType) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error("AFRI_INTEL_EVIDENCE_INVALID");
  }

  let url;
  try {
    url = new URL(item.url);
  } catch {
    throw new Error("AFRI_INTEL_EVIDENCE_URL_INVALID");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("AFRI_INTEL_EVIDENCE_URL_INVALID");
  }

  const title = String(item.title ?? "").trim();
  if (!title) throw new Error("AFRI_INTEL_EVIDENCE_TITLE_REQUIRED");

  return Object.freeze({
    sourceId: String(adapter.id),
    sourceType,
    url: url.href,
    title: title.slice(0, 500),
    snippet: String(item.snippet ?? "").slice(0, 2000),
    retrievedAt: new Date().toISOString(),
    provenance: Object.freeze({ adapterId: String(adapter.id) })
  });
}

const AfriIntelSearchEngine = {
  async search(input = {}, { adapters = [], context = {} } = {}) {
    const plan = AfriIntelQueryPlanner.plan(input);
    if (!Array.isArray(adapters) || adapters.length === 0) {
      throw new Error("AFRI_INTEL_NO_SEARCH_ADAPTERS");
    }

    const jobs = [];
    for (const sourceType of plan.sources) {
      for (const adapter of adapters) {
        if (!adapter || typeof adapter.id !== "string" ||
            typeof adapter.supports !== "function" ||
            typeof adapter.search !== "function") continue;
        if (adapter.supports(sourceType)) {
          jobs.push({ adapter, sourceType });
        }
      }
    }

    if (!jobs.length) throw new Error("AFRI_INTEL_NO_COMPATIBLE_ADAPTERS");

    const outcomes = await Promise.allSettled(jobs.map(async ({ adapter, sourceType }) => {
      const result = await adapter.search({
        query: plan.query,
        sourceType,
        limit: plan.limit
      }, context);

      if (!Array.isArray(result)) {
        throw new Error("AFRI_INTEL_ADAPTER_RESULT_INVALID");
      }

      return result.map(item => normalizeEvidence(item, adapter, sourceType));
    }));

    const evidenceValidationFailure = outcomes.find(outcome => outcome.status === "rejected" && /^AFRI_INTEL_EVIDENCE_/.test(String(outcome.reason?.message || "")));
    if (evidenceValidationFailure) throw evidenceValidationFailure.reason;

    const evidence = [];
    const errors = [];
    for (let index = 0; index < outcomes.length; index++) {
      const outcome = outcomes[index];
      if (outcome.status === "fulfilled") evidence.push(...outcome.value);
      else errors.push({
        adapterId: jobs[index].adapter.id,
        sourceType: jobs[index].sourceType,
        code: "AFRI_INTEL_ADAPTER_FAILED"
      });
    }

    if (!evidence.length && errors.length) {
      throw new Error("AFRI_INTEL_ALL_ADAPTERS_FAILED");
    }

    return {
      query: plan.query,
      sources: plan.sources,
      evidence,
      adapterErrors: errors,
      partial: errors.length > 0
    };
  }
};

export default AfriIntelSearchEngine;
