import crypto from "node:crypto";

const PATH = "/api/a2a/internal/tasks";
const SOURCE_AGENT_ID = "AGENT-AFRIAICOMMAND-001";
const MAX_REQUEST_BYTES = 65536;
const MAX_RESPONSE_BYTES = 65536;

export function createAfriInternalA2AHttpClient({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = () => Date.now(),
  timeoutMs = 30000
} = {}) {
  return Object.freeze({
    async execute({ agentId, task, context = {} } = {}) {
      if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147483647) {
        throw new Error("AFRI_INTERNAL_A2A_TIMEOUT_INVALID");
      }
      if (typeof fetchImpl !== "function") {
        throw new Error("AFRI_INTERNAL_A2A_FETCH_UNAVAILABLE");
      }
      if (typeof agentId !== "string" || !agentId.trim() ||
          !task || typeof task !== "object" || Array.isArray(task) ||
          !context || typeof context !== "object" || Array.isArray(context)) {
        throw new Error("AFRI_INTERNAL_A2A_REQUEST_INVALID");
      }

      const secret = env.A2A_INTERNAL_AGENT_SECRET_AFRIAICOMMAND;
      if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error("AFRI_INTERNAL_A2A_CREDENTIALS_UNAVAILABLE");
      }

      const base = env.A2A_INTERNAL_BASE_URL ||
        env.A2A_PUBLIC_BASE_URL ||
        "https://afridigital-api.onrender.com";

      let url;
      try {
        url = new URL(base);
      } catch {
        throw new Error("AFRI_INTERNAL_A2A_BASE_URL_INVALID");
      }
      if (url.pathname !== "/") {
        throw new Error("AFRI_INTERNAL_A2A_BASE_URL_INVALID");
      }
      if (url.protocol !== "https:" || url.username || url.password ||
          url.search || url.hash) {
        throw new Error("AFRI_INTERNAL_A2A_HTTPS_REQUIRED");
      }

      const body = { agentId: agentId.trim(), task, context };
      let bodyText;
      try {
        bodyText = JSON.stringify(body);
      } catch {
        throw new Error("AFRI_INTERNAL_A2A_REQUEST_INVALID");
      }
      if (Buffer.byteLength(bodyText, "utf8") > MAX_REQUEST_BYTES) {
        throw new Error("AFRI_INTERNAL_A2A_REQUEST_TOO_LARGE");
      }

      const timestamp = now();
      if (!Number.isSafeInteger(timestamp)) {
        throw new Error("AFRI_INTERNAL_A2A_CLOCK_INVALID");
      }
      const nonce = crypto.randomBytes(24).toString("base64url");
      const signed = {
        method: "POST",
        path: PATH,
        agentId: SOURCE_AGENT_ID,
        timestamp,
        nonce,
        body
      };
      const signature = crypto.createHmac("sha256", secret)
        .update(JSON.stringify(signed), "utf8")
        .digest("hex");

      let response;
      try {
        response = await fetchImpl(`${url.origin}${PATH}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-afri-agent-id": SOURCE_AGENT_ID,
            "x-afri-timestamp": String(timestamp),
            "x-afri-nonce": nonce,
            "x-afri-signature": signature
          },
          body: bodyText,
          signal: AbortSignal.timeout(timeoutMs)
        });
      } catch {
        throw new Error("AFRI_INTERNAL_A2A_TRANSPORT_FAILED");
      }

      let responseText = "";
      let reader;
      try {
        reader = response.body?.getReader();
        if (!reader) throw new Error("RESPONSE_BODY_UNAVAILABLE");

        const decoder = new TextDecoder("utf-8", { fatal: true });
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!(value instanceof Uint8Array)) {
            throw new Error("RESPONSE_CHUNK_INVALID");
          }

          receivedBytes += value.byteLength;
          if (receivedBytes > MAX_RESPONSE_BYTES) {
            try { await reader.cancel(); } catch {}
            throw new Error("AFRI_INTERNAL_A2A_RESPONSE_TOO_LARGE");
          }
          responseText += decoder.decode(value, { stream: true });
        }
        responseText += decoder.decode();
      } catch (error) {
        if (error?.message === "AFRI_INTERNAL_A2A_RESPONSE_TOO_LARGE") throw error;
        throw new Error("AFRI_INTERNAL_A2A_RESPONSE_UNREADABLE");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("AFRI_INTERNAL_A2A_RESPONSE_INVALID");
      }

      if (!response.ok || data?.ok !== true) {
        const code = data?.error?.code;
        throw new Error(
          typeof code === "string" && /^[A-Z0-9_:-]{1,100}$/.test(code)
            ? code
            : "AFRI_INTERNAL_A2A_EXECUTION_FAILED"
        );
      }
      return data.result;
    }
  });
}

const AfriInternalA2AHttpClient = createAfriInternalA2AHttpClient();
export default AfriInternalA2AHttpClient;
