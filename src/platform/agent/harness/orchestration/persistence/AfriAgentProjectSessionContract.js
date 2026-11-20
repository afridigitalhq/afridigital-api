export const PROJECT_SESSION_STATUSES = Object.freeze([
  "QUEUED", "PLANNING", "RUNNING", "WAITING_APPROVAL",
  "WAITING_INPUT", "PAUSED", "COMPLETED", "PARTIAL",
  "FAILED", "CANCELLED"
]);

export const PROJECT_TASK_STATUSES = Object.freeze([
  "PENDING", "CLAIMED", "RUNNING", "WAITING_APPROVAL",
  "COMPLETED", "FAILED", "SKIPPED", "CANCELLED",
  "INTERRUPTED", "NEEDS_RECONCILIATION"
]);

export const PROJECT_SESSION_LIMITS = Object.freeze({
  objectiveBytes: 12000,
  acceptanceCriteria: 30,
  tasksPerSession: 100,
  taskBytes: 8000,
  resultBytes: 65536,
  eventDetailsBytes: 16384,
  maxAttempts: 5,
  maxLeaseSeconds: 900
});

const isRecord = value =>
  value !== null && typeof value === "object" &&
  !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === Object.prototype ||
   Object.getPrototypeOf(value) === null);

export function assertProjectText(value, field, maxBytes) {
  if (typeof value !== "string" || !value.trim() ||
      Buffer.byteLength(value, "utf8") > maxBytes) {
    throw new TypeError(`AFRI_PROJECT_INVALID_${field.toUpperCase()}`);
  }
  return value.trim();
}

export function assertProjectJson(value, field, maxBytes) {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new TypeError(`AFRI_PROJECT_INVALID_${field.toUpperCase()}`);
  }
  if (serialized === undefined ||
      Buffer.byteLength(serialized, "utf8") > maxBytes) {
    throw new TypeError(`AFRI_PROJECT_INVALID_${field.toUpperCase()}`);
  }
  return JSON.parse(serialized);
}

export function validateProjectSessionInput(input) {
  if (!isRecord(input)) throw new TypeError("AFRI_PROJECT_INVALID_SESSION");
  const objective = assertProjectText(
    input.objective, "objective", PROJECT_SESSION_LIMITS.objectiveBytes
  );
  const requesterId = assertProjectText(input.requesterId, "requester_id", 256);
  const sourceAgentId = assertProjectText(input.sourceAgentId, "source_agent_id", 256);
  const acceptanceCriteria = input.acceptanceCriteria ?? [];
  if (!Array.isArray(acceptanceCriteria) ||
      acceptanceCriteria.length > PROJECT_SESSION_LIMITS.acceptanceCriteria) {
    throw new TypeError("AFRI_PROJECT_INVALID_ACCEPTANCE_CRITERIA");
  }
  const criteria = acceptanceCriteria.map((item, index) =>
    assertProjectText(item, `acceptance_criteria_${index}`, 2000)
  );
  const budget = input.budget ?? {};
  if (!isRecord(budget)) throw new TypeError("AFRI_PROJECT_INVALID_BUDGET");
  const maxTasks = budget.maxTasks ?? PROJECT_SESSION_LIMITS.tasksPerSession;
  const maxAttempts = budget.maxAttempts ?? 3;
  const maxConcurrency = budget.maxConcurrency ?? 2;
  if (!Number.isInteger(maxTasks) || maxTasks < 1 ||
      maxTasks > PROJECT_SESSION_LIMITS.tasksPerSession ||
      !Number.isInteger(maxAttempts) || maxAttempts < 1 ||
      maxAttempts > PROJECT_SESSION_LIMITS.maxAttempts ||
      !Number.isInteger(maxConcurrency) || maxConcurrency < 1 ||
      maxConcurrency > 8) {
    throw new TypeError("AFRI_PROJECT_INVALID_BUDGET");
  }
  return {
    objective,
    requesterId,
    sourceAgentId,
    acceptanceCriteria: criteria,
    budget: { maxTasks, maxAttempts, maxConcurrency }
  };
}

export function validateProjectTaskInput(task, index = 0, stepOffset = 0) {
  if (!isRecord(task)) throw new TypeError("AFRI_PROJECT_INVALID_TASK");
  const agentId = assertProjectText(task.agentId, "task_agent_id", 256);
  const capabilityId = assertProjectText(task.capabilityId, "task_capability_id", 256);
  const description = assertProjectText(
    task.description, "task_description", PROJECT_SESSION_LIMITS.taskBytes
  );
  if (!Number.isInteger(index) || index < 0 || !Number.isInteger(stepOffset) || stepOffset < 0) throw new TypeError("AFRI_PROJECT_INVALID_TASK_INDEX");
  const stepIndex = stepOffset + index;
  const dependencies = task.dependencies ?? [];
  if (!Array.isArray(dependencies) ||
      dependencies.some(dep => !Number.isInteger(dep) || dep < 0 || dep >= stepIndex) ||
      new Set(dependencies).size !== dependencies.length) {
    throw new TypeError("AFRI_PROJECT_INVALID_TASK_DEPENDENCIES");
  }
  return {
    stepIndex,
    agentId,
    capabilityId,
    description,
    dependencies
  };
}
