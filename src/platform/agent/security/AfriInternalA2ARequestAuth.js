import crypto from "node:crypto";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import { getAfriPostgresPool } from "../../database/postgres/AfriPostgresRuntime.js";
import AfriInternalA2ANoncePostgresRepository from "./AfriInternalA2ANoncePostgresRepository.js";

const NONCE_TTL_MS = 5 * 60 * 1000;
const INTERNAL_AGENTS = Object.freeze({
  afriaicommand: {
    id: AfriAgentProfiles.afriaicommand?.id,
    secret: "A2A_INTERNAL_AGENT_SECRET_AFRIAICOMMAND"
  },
  afriaicoder: {
    id: AfriAgentProfiles.afriaicoder?.id,
    secret: "A2A_INTERNAL_AGENT_SECRET_AFRIAICODER"
  }
});

export function createAfriInternalA2ARequestAuth({
  env = process.env,
  identityRegistry = AfriAgentIdentityRegistry,
  getPool = getAfriPostgresPool,
  nonceRepositoryFactory,
  now = () => Date.now()
} = {}) {
  let nonceRepository;

  function getRepository() {
    if (!nonceRepository) {
      nonceRepository = nonceRepositoryFactory
        ? nonceRepositoryFactory()
        : new AfriInternalA2ANoncePostgresRepository({ pool: getPool() });
    }
    return nonceRepository;
  }

  function resolveIdentity(agentId) {
    if (typeof agentId !== "string" || !agentId.trim()) return null;
    const entry = Object.values(INTERNAL_AGENTS).find(item => item.id === agentId);
    if (!entry) return null;

    const agent = identityRegistry.get(agentId);
    if (
      !agent ||
      agent.id !== entry.id ||
      agent.status !== "ACTIVE" ||
      agent.trustDomain !== "INTERNAL" ||
      agent.organizationId !== "afridigital" ||
      !Object.hasOwn(INTERNAL_AGENTS, agent.key) ||
      INTERNAL_AGENTS[agent.key]?.id !== agent.id
    ) return null;

    return agent;
  }

  async function isReady() {
    try {
      const agents = identityRegistry.list();
      for (const [key, entry] of Object.entries(INTERNAL_AGENTS)) {
        const agent = agents.find(item => item?.key === key && item.id === entry.id);
        const secret = env[entry.secret];
        if (
          !agent ||
          agent.status !== "ACTIVE" ||
          agent.trustDomain !== "INTERNAL" ||
          agent.organizationId !== "afridigital" ||
          typeof secret !== "string" ||
          Buffer.byteLength(secret, "utf8") < 32
        ) return false;
      }
      await getRepository().initialize();
      return true;
    } catch {
      return false;
    }
  }

  async function verify({
    method, path, agentId, timestamp, nonce, body, signature
  } = {}) {
    if (
      typeof method !== "string" || !/^[A-Z]{3,10}$/.test(method) ||
      typeof path !== "string" || !path.startsWith("/") || path.length > 512 ||
      typeof agentId !== "string" ||
      typeof timestamp !== "string" && typeof timestamp !== "number" ||
      typeof nonce !== "string" ||
      typeof signature !== "string"
    ) return { verified: false, code: "A2A_AUTH_REQUIRED" };

    const numericTimestamp = Number(timestamp);
    const currentTime = now();
    if (
      !Number.isSafeInteger(numericTimestamp) ||
      !Number.isSafeInteger(currentTime) ||
      Math.abs(currentTime - numericTimestamp) > NONCE_TTL_MS
    ) return { verified: false, code: "A2A_REQUEST_EXPIRED" };

    if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce)) {
      return { verified: false, code: "A2A_NONCE_INVALID" };
    }

    const agent = resolveIdentity(agentId);
    if (!agent) return { verified: false, code: "A2A_AGENT_NOT_AUTHORIZED" };

    const secretName = INTERNAL_AGENTS[agent.key]?.secret;
    const secret = env[secretName];
    if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
      return { verified: false, code: "A2A_AGENT_CREDENTIAL_NOT_CONFIGURED" };
    }

    let payload;
    try {
      payload = JSON.stringify({
        method, path, agentId, timestamp: numericTimestamp, nonce, body
      });
    } catch {
      return { verified: false, code: "A2A_REQUEST_BODY_INVALID" };
    }
    if (typeof payload !== "string" || Buffer.byteLength(payload, "utf8") > 65536) {
      return { verified: false, code: "A2A_REQUEST_SIZE_LIMIT_EXCEEDED" };
    }

    const expected = crypto.createHmac("sha256", secret).update(payload, "utf8").digest();
    const suppliedHex = signature.replace(/^HMAC-/i, "");
    if (!/^[a-f0-9]{64}$/i.test(suppliedHex)) {
      return { verified: false, code: "A2A_SIGNATURE_INVALID" };
    }
    const supplied = Buffer.from(suppliedHex, "hex");
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
      return { verified: false, code: "A2A_SIGNATURE_INVALID" };
    }

    try {
      const consumed = await getRepository().consume({
        agentId,
        nonce,
        now: currentTime,
        expiresAt: Math.max(currentTime, numericTimestamp) + NONCE_TTL_MS
      });
      if (!consumed) return { verified: false, code: "A2A_NONCE_REPLAYED" };
    } catch {
      return { verified: false, code: "A2A_REPLAY_PROTECTION_UNAVAILABLE" };
    }

    return {
      verified: true,
      agent: Object.freeze({ id: agent.id, key: agent.key }),
      requestOrigin: "INTERNAL"
    };
  }

  return Object.freeze({ isReady, verify });
}

const AfriInternalA2ARequestAuth = createAfriInternalA2ARequestAuth();
export default AfriInternalA2ARequestAuth;
