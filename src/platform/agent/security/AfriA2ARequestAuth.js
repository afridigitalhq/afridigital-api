import crypto from "node:crypto";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import { getAfriPostgresPool } from "../../database/postgres/AfriPostgresRuntime.js";
import AfriA2ANoncePostgresRepository from "./AfriA2ANoncePostgresRepository.js";

const NONCE_TTL_MS = 5 * 60 * 1000;

const PUBLIC_AGENT_SECRETS = Object.freeze({
  afriai: "A2A_AGENT_SECRET_AFRIAI",
  afridebug: "A2A_AGENT_SECRET_AFRIDEBUG",
  afrirea: "A2A_AGENT_SECRET_AFRIREA",
  afriforex: "A2A_AGENT_SECRET_AFRIFOREX"
});

const PUBLIC_AGENT_PROFILE_IDS = Object.freeze(
  Object.fromEntries(
    Object.keys(PUBLIC_AGENT_SECRETS).map(key => [key, AfriAgentProfiles[key]?.id || null])
  )
);

export function createAfriA2ARequestAuth({
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
        : new AfriA2ANoncePostgresRepository({ pool: getPool() });
    }
    return nonceRepository;
  }

  function resolvePublicIdentity(agentId) {
    if (typeof agentId !== "string" || !agentId.trim()) return null;
    const agent = identityRegistry.get(agentId);

    if (
      !agent ||
      agent.status !== "ACTIVE" ||
      !Object.hasOwn(PUBLIC_AGENT_SECRETS, agent.key) ||
      agent.id !== PUBLIC_AGENT_PROFILE_IDS[agent.key]
    ) {
      return null;
    }

    return agent;
  }

  async function isReady() {
    try {
      const activeAgents = identityRegistry.list();

      for (const [key, envName] of Object.entries(PUBLIC_AGENT_SECRETS)) {
        const secret = env[envName];
        const active = activeAgents.some(
          agent => agent?.key === key &&
            agent.id === PUBLIC_AGENT_PROFILE_IDS[key] &&
            agent.status === "ACTIVE"
        );

        if (!active || typeof secret !== "string" || secret.length < 32) {
          return false;
        }
      }

      await getRepository().initialize();
      return true;
    } catch {
      return false;
    }
  }

  async function verify({ method, path, agentId, timestamp, nonce, body, signature } = {}) {
    if (!method || !path || !agentId || !timestamp || !nonce || !signature) {
      return { verified: false, code: "A2A_AUTH_REQUIRED" };
    }

    const numericTimestamp = Number(timestamp);
    const currentTime = now();

    if (
      !Number.isFinite(numericTimestamp) ||
      Math.abs(currentTime - numericTimestamp) > NONCE_TTL_MS
    ) {
      return { verified: false, code: "A2A_REQUEST_EXPIRED" };
    }

    const agent = resolvePublicIdentity(agentId);
    if (!agent) {
      return { verified: false, code: "A2A_AGENT_NOT_AUTHORIZED" };
    }

    const secret = env[PUBLIC_AGENT_SECRETS[agent.key]];
    if (typeof secret !== "string" || secret.length < 32) {
      return { verified: false, code: "A2A_AGENT_CREDENTIAL_NOT_CONFIGURED" };
    }

    const payload = JSON.stringify({
      method,
      path,
      agentId,
      timestamp: numericTimestamp,
      nonce,
      body
    });

    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest();

    const suppliedHex = String(signature).replace(/^HMAC-/i, "");
    if (!/^[a-f0-9]{64}$/i.test(suppliedHex)) {
      return { verified: false, code: "A2A_SIGNATURE_INVALID" };
    }

    const supplied = Buffer.from(suppliedHex, "hex");
    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(supplied, expected)
    ) {
      return { verified: false, code: "A2A_SIGNATURE_INVALID" };
    }

    try {
      const consumed = await getRepository().consume({
        agentId,
        nonce,
        now: currentTime,
        expiresAt: Math.max(currentTime, numericTimestamp) + NONCE_TTL_MS
      });

      if (!consumed) {
        return { verified: false, code: "A2A_NONCE_REPLAYED" };
      }
    } catch {
      return { verified: false, code: "A2A_REPLAY_PROTECTION_UNAVAILABLE" };
    }

    return {
      verified: true,
      algorithm: "HMAC-SHA256",
      agentId,
      timestamp: numericTimestamp,
      nonce
    };
  }

  return Object.freeze({ verify, isReady });
}

export default createAfriA2ARequestAuth();
