import AfriAgentIdentityRegistry from "../../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../../registry/AfriAgentCapabilityRegistry.js";
import AfriA2AAuthorization from "../../security/AfriA2AAuthorization.js";

function reject(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function resolveTarget({ agentId, capabilityId, allowInternalOnly = false } = {}) {
  if (typeof agentId !== "string" || !agentId.trim()) reject("AGENT_ID_REQUIRED");
  const agent = AfriAgentIdentityRegistry.get(agentId);
  if (!agent) reject("AGENT_NOT_FOUND");
  if (agent.status !== "ACTIVE") reject("AGENT_NOT_ACTIVE");
  if (typeof capabilityId !== "string" || !capabilityId.trim()) reject("CAPABILITY_FORBIDDEN");

  const capability = AfriAgentCapabilityRegistry.get(capabilityId);
  if (!capability) reject("CAPABILITY_NOT_FOUND");
  if (!capability.enabled) reject("CAPABILITY_DISABLED");
  if (!Array.isArray(agent.capabilities) || !agent.capabilities.includes(capability.id)) {
    reject("CAPABILITY_FORBIDDEN");
  }
  if (capability.adminOnly === true) reject("ADMIN_AUTHORIZATION_REQUIRED");
  if (capability.internalOnly === true && !allowInternalOnly) {
    reject("INTERNAL_EXECUTION_REQUIRED");
  }
  return Object.freeze({ agent, capability });
}

const AfriAgentAuthorization = {
  resolve(input = {}) {
    return resolveTarget(input);
  },

  resolveInternal({
    sourceAgentId,
    sourceCapabilityId,
    agentId,
    capabilityId
  } = {}) {
    const source = AfriAgentIdentityRegistry.get(sourceAgentId);
    if (!source) reject("SOURCE_AGENT_NOT_FOUND");
    if (source.status !== "ACTIVE") reject("SOURCE_AGENT_NOT_ACTIVE");

    if (
      typeof sourceCapabilityId !== "string" ||
      !sourceCapabilityId.trim()
    ) {
      reject("SOURCE_CAPABILITY_REQUIRED");
    }

    const sourceCapability =
      AfriAgentCapabilityRegistry.get(sourceCapabilityId);

    if (!sourceCapability) reject("SOURCE_CAPABILITY_NOT_FOUND");
    if (sourceCapability.enabled !== true) {
      reject("SOURCE_CAPABILITY_DISABLED");
    }

    if (
      sourceCapability.adminOnly === true ||
      !Array.isArray(source.capabilities) ||
      !source.capabilities.includes(sourceCapabilityId)
    ) {
      reject("SOURCE_CAPABILITY_FORBIDDEN");
    }

    try {
      AfriA2AAuthorization.authorize({
        sourceAgentId,
        targetAgentId: agentId,
        capability: capabilityId,
        requestOrigin: "INTERNAL"
      });
    } catch {
      reject("INTERNAL_AUTHORIZATION_REQUIRED");
    }

    return resolveTarget({
      agentId,
      capabilityId,
      allowInternalOnly: true
    });
  }
};

export default AfriAgentAuthorization;
