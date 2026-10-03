import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import { AfriA2AError, A2A_ERRORS } from "../a2a/AfriA2AErrors.js";

const AfriA2AAuthorization = {
  authorize({
    sourceAgentId = null,
    targetAgentId = null,
    capability = null,
    requestOrigin = "EXTERNAL"
  } = {}) {
    const target = AfriAgentIdentityRegistry.get(targetAgentId);

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

    if (requestOrigin === "INTERNAL") {
      const source = AfriAgentIdentityRegistry.get(sourceAgentId);

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

      if (
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

export default AfriA2AAuthorization;
