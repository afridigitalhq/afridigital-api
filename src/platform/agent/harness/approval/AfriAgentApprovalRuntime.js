import { AfriAgentApprovalAuthority, createAfriAgentApprovalAuthorizer } from "./AfriAgentApprovalAuthority.js";
import { AfriAgentApprovalPostgresRepository } from "./AfriAgentApprovalPostgresRepository.js";
import { createAfriAgentDelegationExecutor } from "../orchestration/AfriAgentDelegationExecutor.js";
import { createAfriAICommandRuntime } from "../../command/AfriAICommandRuntime.js";
import { AfriAgentArtifactPostgresRepository } from "../artifacts/AfriAgentArtifactPostgresRepository.js";
import { AfriAgentArtifactApprovalPostgresRepository } from "../artifacts/AfriAgentArtifactApprovalPostgresRepository.js";
import { AfriAgentArtifactApprovalAuthority } from "../artifacts/AfriAgentArtifactApprovalAuthority.js";

let runtime = null;
let initialization = null;

export async function createAfriAgentApprovalRuntime({ pool, sessionService, auditRepository, executionLeaseMs } = {}) {
  if (!pool || typeof pool.query !== "function") {
    throw new Error("AFRI_APPROVAL_POSTGRES_POOL_REQUIRED");
  }
  if (!sessionService || typeof sessionService.verifyPrincipal !== "function") {
    throw new Error("AFRI_APPROVAL_IDENTITY_SERVICE_REQUIRED");
  }
  if (!auditRepository || typeof auditRepository.appendAuditEvent !== "function") {
    throw new Error("AFRI_EXECUTION_GRANT_AUDIT_REPOSITORY_REQUIRED");
  }

  const repository = new AfriAgentApprovalPostgresRepository({ pool });
  await repository.initialize();

  const authority = new AfriAgentApprovalAuthority({
    repository,
    auditRepository,
    authorizeApprover: createAfriAgentApprovalAuthorizer({ sessionService }),
    ...(executionLeaseMs === undefined ? {} : { executionLeaseMs })
  });

  await authority.recoverExpiredGrantSteps();

  const artifactRepository = new AfriAgentArtifactPostgresRepository({ pool });
  await artifactRepository.initialize();

  const artifactApprovalRepository = new AfriAgentArtifactApprovalPostgresRepository({ pool });
  await artifactApprovalRepository.initialize();

  const artifactApprovalAuthority = new AfriAgentArtifactApprovalAuthority({
    repository: artifactApprovalRepository,
    artifactRepository,
    sessionService
  });
  const delegationExecutor = createAfriAgentDelegationExecutor({
    approvalAuthority: authority
  });
  const commandRuntime = createAfriAICommandRuntime({ delegationExecutor });

  return Object.freeze({
    repository, authority, delegationExecutor, commandRuntime, sessionService, auditRepository,
    artifactRepository, artifactApprovalRepository, artifactApprovalAuthority
  });
}

export async function initializeAfriAgentApprovalRuntime(options = {}) {
  if (runtime) return runtime;
  if (initialization) return initialization;

  initialization = createAfriAgentApprovalRuntime(options);
  try {
    runtime = await initialization;
    return runtime;
  } catch (error) {
    initialization = null;
    throw error;
  } finally {
    if (runtime) initialization = null;
  }
}

export function getAfriAgentApprovalRuntime() {
  if (!runtime) throw new Error("AFRI_AGENT_APPROVAL_RUNTIME_NOT_INITIALIZED");
  return runtime;
}
