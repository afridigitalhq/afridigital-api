import axios from "axios";
import { createOllamaDiagnosticsAuthorization } from "./ollama-diagnostics-auth.js";

const ENDPOINT = "https://ollama.com/api/chat";
const MODEL = "gemma4:31b";
const PROMPT = "Reply with OK.";
const MAX_TIMEOUT_MS = 20000;

export default function ollamaCloudAuthTestRoute(app, {
  getIdentityRuntime,
  client = axios,
  timeoutMs = MAX_TIMEOUT_MS
} = {}) {
  const requireDiagnosticsAdmin =
    createOllamaDiagnosticsAuthorization({ getIdentityRuntime });

  app.post("/api/afriai/ollama-cloud-auth-test", requireDiagnosticsAdmin, async (req, res) => {
    res.setHeader("Cache-Control", "no-store");

    const started = Date.now();
    const apiKey = process.env.OLLAMA_API_KEY?.trim();

    if (!apiKey) {
      return res.status(503).json({
        provider: "ollama",
        status: "KEY_NOT_CONFIGURED"
      });
    }

    const timeout = Math.min(
      MAX_TIMEOUT_MS,
      Math.max(1000, Number(timeoutMs) || MAX_TIMEOUT_MS)
    );

    try {
      const response = await client.post(
        ENDPOINT,
        {
          model: MODEL,
          messages: [{ role: "user", content: PROMPT }],
          stream: false,
          options: { num_predict: 1, temperature: 0 }
        },
        {
          timeout,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      return res.json({
        provider: "ollama",
        status: "AUTHORIZED",
        model: MODEL,
        durationMs: Date.now() - started
      });
    } catch (error) {
      const upstreamStatus = Number.isInteger(error?.response?.status)
        ? error.response.status
        : null;

      let status = "UPSTREAM_ERROR";

      if (upstreamStatus === 401) status = "UNAUTHORIZED";
      else if (upstreamStatus === 403) status = "ACCESS_FORBIDDEN";
      else if ([400, 404, 422].includes(upstreamStatus)) status = "MODEL_ACCESS_ERROR";
      else if (upstreamStatus === 429) status = "RATE_LIMITED";
      else if (!upstreamStatus) status = "REQUEST_ERROR";

      return res.json({
        provider: "ollama",
        status,
        upstreamStatus,
        model: MODEL,
        durationMs: Date.now() - started
      });
    }
  });
}
