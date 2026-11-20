import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import { AfriA2AError, A2A_ERRORS } from "../a2a/AfriA2AErrors.js";

const PUBLIC_AGENT_KEYS = Object.freeze([
  "afriai",
  "afridebug",
  "afrirea",
  "afriforex"
]);

function isPublishedIdentity(identity) {
  if (!identity || identity.status !== "ACTIVE") return false;

  return PUBLIC_AGENT_KEYS.some(key => {
    const profile = AfriAgentProfiles[key];
    return profile?.id === identity.id && identity.key === key;
  });
}

export function createAfriA2AAuthorization({ identityRegistry = AfriAgentIdentityRegistry } = {}) {
  if (!identityRegistry || typeof identityRegistry.get !== "function") throw new TypeError("A valid identity registry is required");
  return {
  authorize({
    sourceAgentId = null,
    targetAgentId = null,
    capability = null,
    requestOrigin = "EXTERNAL"
  } = {}) {
    if (requestOrigin !== "EXTERNAL" && requestOrigin !== "INTERNAL") {
      throw new AfriA2AError(
        A2A_ERRORS.INVALID_REQUEST,
        "Unsupported A2A request origin"
      );
    }

    const target = identityRegistry.get(targetAgentId);

    if (!target) {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_NOT_FOUND,
        "Target agent identity was not found"
      );
    }

    if (target.status !== "ACTIVE") {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_REVOKED,
        "Target agent identity is not active"
      );
    }

    const source = identityRegistry.get(sourceAgentId);

    if (!source) {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_NOT_FOUND,
        "Source agent identity was not found"
      );
    }

    if (source.status !== "ACTIVE") {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_REVOKED,
        "Source agent identity is not active"
      );
    }

    if (requestOrigin === "EXTERNAL") {
      if (
        !isPublishedIdentity(source) ||
        !isPublishedIdentity(target)
      ) {
        throw new AfriA2AError(
          A2A_ERRORS.AUTHORIZATION_FORBIDDEN,
          "External A2A access is restricted to published agent identities"
        );
      }
    } else if (
      source.trustDomain !== "INTERNAL" ||
      target.trustDomain !== "INTERNAL" ||
      !source.organizationId ||
      !target.organizationId ||
      source.organizationId !== target.organizationId
    ) {
      throw new AfriA2AError(
        A2A_ERRORS.AUTHORIZATION_FORBIDDEN,
        "Internal agent authorization is not permitted"
      );
    }

    return {
      authorized: true,
      requestOrigin,
      sourceAgentId,
      targetAgentId: target.id,
      capability: capability || null
    };
  }
};
}

const AfriA2AAuthorization = createAfriA2AAuthorization();
export default AfriA2AAuthorization;
