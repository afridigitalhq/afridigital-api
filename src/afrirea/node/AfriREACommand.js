import { fetchPage } from "./AfriREAHttpTransport.js";
import { inspectHtml } from "./AfriREAHtmlAuditor.js";

export async function runAfriREACommand(request, dependencies = {}) {
  const fetch = dependencies.fetchPage || fetchPage;
  const inspect = dependencies.inspectHtml || inspectHtml;

  try {
    if (!request || typeof request !== "object" || Array.isArray(request)) {
      throw new Error("REQUEST_OBJECT_REQUIRED");
    }

    const url = request.url;
    if (typeof url !== "string" || !url || url.length > 2048) {
      throw new Error("AFRIREA_URL_REQUIRED");
    }

    const fetched = await fetch(url);

    if (!fetched || fetched.ok !== true) {
      const reason = fetched?.reason;
      return {
        ok: false,
        error: typeof reason === "string" && /^[A-Z0-9_]{1,80}$/.test(reason)
          ? reason
          : "AFRIREA_FETCH_FAILED"
      };
    }

    if (!Buffer.isBuffer(fetched.body) || typeof fetched.url !== "string") {
      return { ok: false, error: "AFRIREA_ENGINE_RESPONSE_INVALID" };
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
      return { ok: false, error: "AFRIREA_ENGINE_FAILED" };
    }

    if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
      return { ok: false, error: "AFRIREA_ENGINE_RESPONSE_INVALID" };
    }

    return { ok: true, analysis };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return {
      ok: false,
      error: /^[A-Z0-9_]{1,80}$/.test(code)
        ? code
        : "AFRIREA_ENGINE_FAILED"
    };
  }
}

export async function main({
  stdin = process.stdin,
  stdout = process.stdout,
  dependencies = {}
} = {}) {
  try {
    const chunks = [];
    let totalBytes = 0;
    for await (const chunk of stdin) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += bytes.length;
      if (totalBytes > 16384) {
        stdout.write(JSON.stringify({ ok: false, error: "AFRIREA_REQUEST_TOO_LARGE" }) + "\n");
        return 0;
      }
      chunks.push(bytes);
    }
    const raw = Buffer.concat(chunks, totalBytes).toString("utf8");
    let request;
    try {
      request = JSON.parse(raw);
    } catch {
      stdout.write(JSON.stringify({ ok: false, error: "AFRIREA_REQUEST_INVALID" }) + "\n");
      return 0;
    }

    const result = await runAfriREACommand(request, dependencies);
    stdout.write(JSON.stringify(result) + "\n");
    return 0;
  } catch {
    try {
      stdout.write(JSON.stringify({
        ok: false,
        error: "AFRIREA_ENGINE_FAILED"
      }) + "\n");
    } catch {}
    return 0;
  }
}
