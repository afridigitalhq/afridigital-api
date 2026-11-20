import { fetchPage } from "../AfriREAHttpTransport.js";
import { inspectHtml } from "../AfriREAHtmlAuditor.js";

export function createAfriREAUrlSourceAdapter(dependencies = {}) {
  const fetch = dependencies.fetchPage || fetchPage;
  const inspect = dependencies.inspectHtml || inspectHtml;

  return {
    async process(source) {
      if (!source || source.type !== "URL" || typeof source.url !== "string" || !source.url.trim()) {
        throw new Error("AFRIREA_URL_SOURCE_INVALID");
      }

      const fetched = await fetch(source.url.trim());

      if (!fetched || fetched.ok !== true) {
        throw new Error("AFRIREA_URL_FETCH_FAILED");
      }

      if (!Buffer.isBuffer(fetched.body) || typeof fetched.url !== "string") {
        throw new Error("AFRIREA_URL_RESPONSE_INVALID");
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
        throw new Error("AFRIREA_URL_ANALYSIS_FAILED");
      }

      if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
        throw new Error("AFRIREA_URL_ANALYSIS_INVALID");
      }

      return {
        findings: [{
          kind: "WEB_PAGE_ANALYSIS",
          url: fetched.url,
          analysis
        }],
        evidence: [{
          kind: "URL",
          locator: fetched.url,
          contentType: fetched.content_type || "text/html",
          byteLength: fetched.bytes ?? fetched.body.length,
          extractionMethod: "STATIC_HTML_ANALYSIS"
        }],
        limitations: [{
          code: "STATIC_HTML_ONLY",
          message: "JavaScript-rendered content and live interactions were not inspected."
        }]
      };
    }
  };
}

export default createAfriREAUrlSourceAdapter;
