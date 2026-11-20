import OllamaProvider from "../../../modules/afriai/providers/OllamaProvider.js";
import { createOllamaDiagnosticsAuthorization } from "./ollama-diagnostics-auth.js";

const PROMPT = "Explain AfriCommerce in one sentence.";
const MAX_DURATION_MS = 30000;
const MAX_RESULT_LENGTH = 2000;

export default function ollamaTestRoute(app, {
  provider = OllamaProvider,
  timeoutMs = MAX_DURATION_MS,
  ...authOptions
} = {}) {
  const requireDiagnosticsAdmin =
    createOllamaDiagnosticsAuthorization(authOptions);

  app.get("/api/afriai/ollama-test", requireDiagnosticsAdmin, async (req, res) => {
    res.setHeader("Cache-Control", "no-store");

    const started = Date.now();
    let timer;

    try {
      const result = await Promise.race([
        Promise.resolve().then(() => provider.generate(PROMPT)),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            const error = new Error("OLLAMA_DIAGNOSTIC_TIMEOUT");
            error.code = "OLLAMA_DIAGNOSTIC_TIMEOUT";
            reject(error);
          }, Math.min(timeoutMs, MAX_DURATION_MS));
        })
      ]);

      const safeResult =
        typeof result === "string" ? result.trim().slice(0, MAX_RESULT_LENGTH) : "";

      if (!safeResult) {
        return res.status(502).json({
          provider: "ollama",
          status: "EMPTY_RESPONSE",
          model: process.env.OLLAMA_MODEL || null,
          durationMs: Date.now() - started
        });
      }

      return res.json({
        provider: "ollama",
        status: "SUCCESS",
        model: process.env.OLLAMA_MODEL || null,
        durationMs: Date.now() - started,
        result: safeResult
      });
    } catch (error) {
      const timedOut = error?.code === "OLLAMA_DIAGNOSTIC_TIMEOUT";

      return res.status(timedOut ? 504 : 502).json({
        provider: "ollama",
        status: timedOut ? "TIMEOUT" : "FAILED",
        error: timedOut
          ? "OLLAMA_DIAGNOSTIC_TIMEOUT"
          : "OLLAMA_DIAGNOSTIC_FAILED",
        durationMs: Date.now() - started
      });
    } finally {
      if (timer) clearTimeout(timer);
    }
  });
}
