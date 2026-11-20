const SOURCE_TYPES = new Set([
  "URL", "SCREENSHOT", "DOCUMENT", "REPOSITORY", "API_SPEC",
  "WEB_APP", "ANDROID_APP", "AUDIO", "VIDEO", "DATASET"
]);
const ORIGINS = new Set([
  "PUBLIC_URL", "USER_UPLOAD", "CONNECTED_SOURCE", "INTERNAL_REFERENCE"
]);
const REQUEST_KEYS = new Set([
  "objective", "domain", "sources", "requirements", "outputFormat", "metadata"
]);
const SOURCE_KEYS = new Set([
  "sourceId", "type", "origin", "url", "fileId", "revision", "metadata"
]);

function fail(code) {
  throw new Error(code);
}
function plain(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function metadata(value, code) {
  if (value === undefined) return {};
  if (!plain(value) || Object.keys(value).length > 20) fail(code);
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (!/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(key)) fail(code);
    if (typeof item === "string" && item.length <= 500) result[key] = item;
    else if (typeof item === "number" && Number.isFinite(item)) result[key] = item;
    else if (typeof item === "boolean" || item === null) result[key] = item;
    else fail(code);
  }
  return result;
}
function httpsUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 2048) {
    fail("AFRIREA_SOURCE_URL_INVALID");
  }
  let url;
  try { url = new URL(value); } catch { fail("AFRIREA_SOURCE_URL_INVALID"); }
  if (url.protocol !== "https:" || url.username || url.password ||
      (url.port && url.port !== "443")) fail("AFRIREA_SOURCE_URL_INVALID");
  return url.href;
}
function fileReference(value) {
  if (typeof value !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) {
    fail("AFRIREA_SOURCE_FILE_REFERENCE_INVALID");
  }
  return value;
}
function validateSource(source, seen) {
  if (!plain(source)) fail("AFRIREA_SOURCE_INVALID");
  if (Object.keys(source).some(key => !SOURCE_KEYS.has(key))) {
    fail("AFRIREA_SOURCE_FIELD_FORBIDDEN");
  }
  if (typeof source.sourceId !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/.test(source.sourceId) ||
      seen.has(source.sourceId)) fail("AFRIREA_SOURCE_ID_INVALID");
  seen.add(source.sourceId);

  if (!SOURCE_TYPES.has(source.type)) fail("AFRIREA_SOURCE_TYPE_UNSUPPORTED");
  if (!ORIGINS.has(source.origin)) fail("AFRIREA_SOURCE_ORIGIN_INVALID");

  const result = {
    sourceId: source.sourceId,
    type: source.type,
    origin: source.origin
  };
  const urlTypes = new Set(["URL", "REPOSITORY", "WEB_APP"]);
  const fileTypes = new Set([
    "SCREENSHOT", "DOCUMENT", "ANDROID_APP", "AUDIO", "VIDEO", "DATASET"
  ]);

  if (urlTypes.has(source.type)) {
    result.url = httpsUrl(source.url);
  } else if (source.type === "API_SPEC") {
    if (source.url !== undefined) result.url = httpsUrl(source.url);
    if (source.fileId !== undefined) result.fileId = fileReference(source.fileId);
    if (!result.url && !result.fileId) fail("AFRIREA_SOURCE_REFERENCE_REQUIRED");
  } else if (fileTypes.has(source.type)) {
    result.fileId = fileReference(source.fileId);
  }

  if (source.revision !== undefined) {
    if (source.type !== "REPOSITORY" || typeof source.revision !== "string" ||
        !source.revision.trim() || source.revision.length > 160) {
      fail("AFRIREA_SOURCE_REVISION_INVALID");
    }
    result.revision = source.revision.trim();
  }
  result.metadata = metadata(source.metadata, "AFRIREA_SOURCE_METADATA_INVALID");
  return result;
}

export function validateAfriREAResearchRequest(input) {
  if (!plain(input)) fail("AFRIREA_RESEARCH_REQUEST_INVALID");
  if (Object.keys(input).some(key => !REQUEST_KEYS.has(key))) {
    fail("AFRIREA_RESEARCH_REQUEST_FIELD_FORBIDDEN");
  }
  if (typeof input.objective !== "string" || !input.objective.trim() ||
      input.objective.length > 2000) fail("AFRIREA_RESEARCH_OBJECTIVE_INVALID");
  if (typeof input.domain !== "string" ||
      !/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(input.domain)) {
    fail("AFRIREA_RESEARCH_DOMAIN_INVALID");
  }
  if (!Array.isArray(input.sources) || input.sources.length < 1 ||
      input.sources.length > 30) fail("AFRIREA_RESEARCH_SOURCES_INVALID");

  const seen = new Set();
  const sources = input.sources.map(source => validateSource(source, seen));
  const requirements = input.requirements ?? [];
  if (!Array.isArray(requirements) || requirements.length > 30) {
    fail("AFRIREA_RESEARCH_REQUIREMENTS_INVALID");
  }
  const normalizedRequirements = requirements.map(item => {
    if (typeof item !== "string" || !item.trim() || item.length > 200) {
      fail("AFRIREA_RESEARCH_REQUIREMENT_INVALID");
    }
    return item.trim();
  });
  const outputFormat = input.outputFormat ?? "structured_research";
  if (outputFormat !== "structured_research") {
    fail("AFRIREA_RESEARCH_OUTPUT_FORMAT_UNSUPPORTED");
  }

  return {
    objective: input.objective.trim(),
    domain: input.domain.toLowerCase(),
    sources,
    requirements: normalizedRequirements,
    outputFormat,
    metadata: metadata(input.metadata, "AFRIREA_RESEARCH_METADATA_INVALID")
  };
}

export const AfriREAResearchSourceTypes = Object.freeze([...SOURCE_TYPES]);
export default validateAfriREAResearchRequest;
