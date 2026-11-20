import { fetchPage } from "../../../afrirea/node/AfriREAHttpTransport.js";
import { inspectHtml } from "../../../afrirea/node/AfriREAHtmlAuditor.js";
import AfriREASourceAdapterRegistry from "../../../afrirea/node/research/AfriREASourceAdapterRegistry.js";
import AfriREAResearchCoordinator from "../../../afrirea/node/research/AfriREAResearchCoordinator.js";
import { createAfriREAUrlSourceAdapter } from "../../../afrirea/node/research/AfriREAUrlSourceAdapter.js";

export function createAfriREA2AService(dependencies = {}) {
  const fetch = dependencies.fetchPage || fetchPage;
  const inspect = dependencies.inspectHtml || inspectHtml;

  const registry = dependencies.adapterRegistry || new AfriREASourceAdapterRegistry();

  if (!registry.has("URL")) {
    registry.register("URL", createAfriREAUrlSourceAdapter({
      fetchPage: fetch,
      inspectHtml: inspect
    }));
  }

  const coordinator = dependencies.researchCoordinator ||
    new AfriREAResearchCoordinator({ adapterRegistry: registry });

  return {
    async analyze(payload = {}, context = {}) {
      if (process.env.AFRIREA_ENABLED !== "true") {
        throw new Error("AFRIREA_DISABLED");
      }

      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("AFRIREA_PAYLOAD_INVALID");
      }

      if (payload.repositoryPath || payload.path || payload.html) {
        throw new Error("AFRIREA_LOCAL_PATH_OR_RAW_HTML_FORBIDDEN");
      }

      const url = payload.url;
      if (typeof url !== "string" || !url.trim() || url.length > 2048) {
        throw new Error("AFRIREA_URL_REQUIRED");
      }

      const fetched = await fetch(url.trim());

      if (!fetched || fetched.ok !== true) {
        const reason = fetched?.reason;
        throw new Error(
          typeof reason === "string" && /^[A-Z0-9_]{1,80}$/.test(reason)
            ? reason
            : "AFRIREA_FETCH_FAILED"
        );
      }

      if (!Buffer.isBuffer(fetched.body)) {
        throw new Error("AFRIREA_ENGINE_RESPONSE_INVALID");
      }

      let analysis;
      try {
        analysis = inspect(
          fetched.url,
          fetched.body.toString("utf8"),
          200,
          fetched.content_type
        );
      } catch {
        throw new Error("AFRIREA_ENGINE_FAILED");
      }

      if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
        throw new Error("AFRIREA_ENGINE_RESPONSE_INVALID");
      }

      return {
        service: "AfriREA",
        capability: "research.analyze",
        status: "COMPLETED",
        taskId: context.taskId || null,
        analysis
      };
    },

    async research(payload, context = {}) {
      if (process.env.AFRIREA_ENABLED !== "true") {
        throw new Error("AFRIREA_DISABLED");
      }

      return coordinator.run(payload, context);
    }
  };
}

const AfriREA2AService = createAfriREA2AService();
export default AfriREA2AService;
