import { randomUUID } from "node:crypto";
import {
  PROJECT_SESSION_STATUSES,
  PROJECT_TASK_STATUSES,
  PROJECT_SESSION_LIMITS,
  assertProjectJson,
  assertProjectText,
  validateProjectSessionInput,
  validateProjectTaskInput
} from "./AfriAgentProjectSessionContract.js";

const SESSION_STATUS_SET = new Set(PROJECT_SESSION_STATUSES);
const TASK_STATUS_SET = new Set(PROJECT_TASK_STATUSES);

const TASK_TRANSITIONS = Object.freeze({
  CLAIMED: new Set(["RUNNING", "WAITING_APPROVAL", "COMPLETED", "FAILED", "CANCELLED", "INTERRUPTED"]),
  RUNNING: new Set(["WAITING_APPROVAL", "COMPLETED", "FAILED", "CANCELLED", "INTERRUPTED"])
});
const SESSION_TRANSITIONS = Object.freeze({
  QUEUED: new Set(["PLANNING", "CANCELLED", "FAILED"]),
  PLANNING: new Set(["RUNNING", "WAITING_APPROVAL", "WAITING_INPUT", "PAUSED", "FAILED", "CANCELLED"]),
  RUNNING: new Set(["WAITING_APPROVAL", "WAITING_INPUT", "PAUSED", "COMPLETED", "PARTIAL", "FAILED", "CANCELLED"]),
  WAITING_APPROVAL: new Set(["RUNNING", "PAUSED", "FAILED", "CANCELLED"]),
  WAITING_INPUT: new Set(["PLANNING", "RUNNING", "PAUSED", "FAILED", "CANCELLED"]),
  PAUSED: new Set(["PLANNING", "RUNNING", "WAITING_APPROVAL", "WAITING_INPUT", "FAILED", "CANCELLED"]),
  COMPLETED: new Set(),
  PARTIAL: new Set(),
  FAILED: new Set(),
  CANCELLED: new Set()
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS afri_agent_project_sessions (
  id UUID PRIMARY KEY,
  requester_id TEXT NOT NULL,
  source_agent_id TEXT NOT NULL,
  objective TEXT NOT NULL,
  acceptance_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'QUEUED'
    CHECK (status IN (${PROJECT_SESSION_STATUSES.map(s => `'${s}'`).join(",")})),
  budget JSONB NOT NULL,
  version BIGINT NOT NULL DEFAULT 1,
  plan_version BIGINT NOT NULL DEFAULT 0,
  event_sequence BIGINT NOT NULL DEFAULT 0,
  lease_owner TEXT,
  lease_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS afri_agent_project_tasks (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES afri_agent_project_sessions(id),
  step_index INTEGER NOT NULL,
  agent_id TEXT NOT NULL,
  capability_id TEXT NOT NULL,
  description TEXT NOT NULL,
  dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN (${PROJECT_TASK_STATUSES.map(s => `'${s}'`).join(",")})),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL,
  idempotency_key TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB,
  approval_id UUID,
  lease_owner TEXT,
  lease_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, step_index),
  UNIQUE(session_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS afri_agent_project_tasks_claim_idx
  ON afri_agent_project_tasks(session_id, status, step_index);
CREATE INDEX IF NOT EXISTS afri_agent_project_tasks_lease_idx
  ON afri_agent_project_tasks(status, lease_until);
CREATE TABLE IF NOT EXISTS afri_agent_project_events (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES afri_agent_project_sessions(id),
  sequence BIGINT NOT NULL,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('USER','AGENT','SYSTEM')),
  actor_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, sequence)
);
CREATE INDEX IF NOT EXISTS afri_agent_project_events_order_idx
  ON afri_agent_project_events(session_id, sequence);
`;

export function createAfriAgentProjectSessionPostgresRepository({ pool }) {
  if (!pool || typeof pool.query !== "function" ||
      typeof pool.connect !== "function") {
    throw new TypeError("AFRI_PROJECT_POSTGRES_POOL_REQUIRED");
  }

  let initialization;

  async function transaction(work) {
    const client = await pool.connect();
    if (!client || typeof client.query !== "function" ||
        typeof client.release !== "function") {
      throw new TypeError("AFRI_PROJECT_INVALID_POSTGRES_CLIENT");
    }
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {}
      throw error;
    } finally {
      client.release();
    }
  }

  async function appendEventWithClient(client, {
    sessionId, eventType, actorType, actorId, details = {}
  }) {
    const safeType = assertProjectText(eventType, "event_type", 128);
    if (!["USER", "AGENT", "SYSTEM"].includes(actorType)) {
      throw new TypeError("AFRI_PROJECT_INVALID_ACTOR_TYPE");
    }
    const safeActor = assertProjectText(actorId, "actor_id", 256);
    const safeDetails = assertProjectJson(
      details, "event_details", PROJECT_SESSION_LIMITS.eventDetailsBytes
    );

    const updated = await client.query(
      `UPDATE afri_agent_project_sessions
       SET event_sequence = event_sequence + 1, updated_at = NOW()
       WHERE id = $1 RETURNING event_sequence`,
      [sessionId]
    );
    if (!updated.rows?.[0]) {
      throw new Error("AFRI_PROJECT_SESSION_NOT_FOUND");
    }

    const event = await client.query(
      `INSERT INTO afri_agent_project_events
       (id, session_id, sequence, event_type, actor_type, actor_id, details)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb) RETURNING *`,
      [
        randomUUID(), sessionId, Number(updated.rows[0].event_sequence),
        safeType, actorType, safeActor, JSON.stringify(safeDetails)
      ]
    );
    return event.rows[0];
  }

  return Object.freeze({
    async initialize() {
      if (!initialization) {
        initialization = pool.query(SCHEMA).catch(error => {
          initialization = undefined;
          throw error;
        });
      }
      await initialization;
      return true;
    },

    async createSession(input) {
      const data = validateProjectSessionInput(input);
      const id = input.id || randomUUID();

      return transaction(async client => {
        const inserted = await client.query(
          `INSERT INTO afri_agent_project_sessions
           (id, requester_id, source_agent_id, objective,
            acceptance_criteria, budget)
           VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb) RETURNING *`,
          [
            id, data.requesterId, data.sourceAgentId, data.objective,
            JSON.stringify(data.acceptanceCriteria), JSON.stringify(data.budget)
          ]
        );

        await appendEventWithClient(client, {
          sessionId: id,
          eventType: "PROJECT_SESSION_CREATED",
          actorType: "USER",
          actorId: data.requesterId,
          details: { sourceAgentId: data.sourceAgentId }
        });
        return inserted.rows[0];
      });
    },

    async getSession(sessionId) {
      const result = await pool.query(
        "SELECT * FROM afri_agent_project_sessions WHERE id = $1",
        [sessionId]
      );
      return result.rows?.[0] ?? null;
    },

    async updateSession({
      sessionId, expectedVersion, status, planVersion,
      actorType = "SYSTEM", actorId = "AFRI-AGENT-HARNESS"
    }) {
      if (!Number.isInteger(Number(expectedVersion)) || Number(expectedVersion) < 1) {
        throw new TypeError("AFRI_PROJECT_INVALID_EXPECTED_VERSION");
      }
      if (status !== undefined && !SESSION_STATUS_SET.has(status)) {
        throw new TypeError("AFRI_PROJECT_INVALID_SESSION_STATUS");
      }
      if (planVersion !== undefined && (!Number.isInteger(planVersion) || planVersion < 0)) {
        throw new TypeError("AFRI_PROJECT_INVALID_PLAN_VERSION");
      }
      if (!["USER", "AGENT", "SYSTEM"].includes(actorType)) {
        throw new TypeError("AFRI_PROJECT_INVALID_ACTOR_TYPE");
      }
      const safeActor = assertProjectText(actorId, "actor_id", 256);

      return transaction(async client => {
        const selected = await client.query(
          "SELECT id, status, version, plan_version FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",
          [sessionId]
        );
        const current = selected.rows?.[0];
        if (!current) throw new Error("AFRI_PROJECT_VERSION_CONFLICT_OR_NOT_FOUND");
        if (Number(current.version) !== Number(expectedVersion)) {
          throw new Error("AFRI_PROJECT_VERSION_CONFLICT_OR_NOT_FOUND");
        }
        if (status !== undefined && status !== current.status &&
            !SESSION_TRANSITIONS[current.status]?.has(status)) {
          throw new Error("AFRI_PROJECT_INVALID_SESSION_TRANSITION");
        }
        if (status === undefined && planVersion === undefined) {
          throw new TypeError("AFRI_PROJECT_EMPTY_SESSION_UPDATE");
        }

        const result = await client.query(
          `UPDATE afri_agent_project_sessions
           SET status=COALESCE($3,status),
               plan_version=COALESCE($4,plan_version),
               version=version+1, updated_at=NOW()
           WHERE id=$1 AND version=$2 RETURNING *`,
          [sessionId, expectedVersion, status ?? null, planVersion ?? null]
        );
        const updated = result.rows?.[0];
        if (!updated) throw new Error("AFRI_PROJECT_VERSION_CONFLICT_OR_NOT_FOUND");

        await appendEventWithClient(client, {
          sessionId,
          eventType: status !== undefined && status !== current.status
            ? "PROJECT_SESSION_STATUS_CHANGED" : "PROJECT_SESSION_UPDATED",
          actorType,
          actorId: safeActor,
          details: {
            previousStatus: current.status,
            status: updated.status,
            previousPlanVersion: Number(current.plan_version ?? 0),
            planVersion: Number(updated.plan_version ?? 0),
            version: Number(updated.version)
          }
        });
        return updated;
      });
    },

    async createTasks({ sessionId, tasks, maxAttempts }) {
      if (!Array.isArray(tasks) || tasks.length < 1 ||
          tasks.length > PROJECT_SESSION_LIMITS.tasksPerSession ||
          (maxAttempts !== undefined &&
            (!Number.isInteger(maxAttempts) || maxAttempts < 1 ||
             maxAttempts > PROJECT_SESSION_LIMITS.maxAttempts))) {
        throw new TypeError("AFRI_PROJECT_INVALID_TASK_BATCH");
      }

      return transaction(async client => {
        const sr = await client.query(
          "SELECT id, status, budget FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",
          [sessionId]
        );
        const session = sr.rows?.[0];
        if (!session) throw new Error("AFRI_PROJECT_SESSION_NOT_FOUND");
        if (session.status !== "PLANNING") {
          throw new Error("AFRI_PROJECT_SESSION_NOT_PLANNING");
        }

        const budget = session.budget;
        const cr = await client.query(
          "SELECT COUNT(*)::integer AS count FROM afri_agent_project_tasks WHERE session_id=$1",
          [sessionId]
        );
        const existingCount = Number(cr.rows?.[0]?.count ?? 0);
        if (existingCount + tasks.length > budget.maxTasks) {
          throw new Error("AFRI_PROJECT_TASK_BUDGET_EXCEEDED");
        }
        if (maxAttempts !== undefined && maxAttempts !== budget.maxAttempts) {
          throw new Error("AFRI_PROJECT_ATTEMPT_BUDGET_MISMATCH");
        }

        const indexResult = await client.query(
          "SELECT step_index FROM afri_agent_project_tasks WHERE session_id=$1 ORDER BY step_index",
          [sessionId]
        );
        const knownIndexes = new Set(
          (indexResult.rows ?? []).map(row => Number(row.step_index))
        );
        const baseIndex = knownIndexes.size
          ? Math.max(...knownIndexes) + 1
          : 0;

        const normalized = tasks.map((task, index) =>
          validateProjectTaskInput(task, index, baseIndex)
        );

        for (const task of normalized) {
          for (const dependency of task.dependencies) {
            if (!knownIndexes.has(dependency)) {
              throw new Error("AFRI_PROJECT_UNKNOWN_TASK_DEPENDENCY");
            }
          }
          knownIndexes.add(task.stepIndex);
        }

        const created = [];
        for (const task of normalized) {
          const id = randomUUID();
          const result = await client.query(
            `INSERT INTO afri_agent_project_tasks
              (id,session_id,step_index,agent_id,capability_id,description,dependencies,max_attempts,idempotency_key)
              VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9) RETURNING *`,
            [
              id, sessionId, task.stepIndex, task.agentId,
              task.capabilityId, task.description,
              JSON.stringify(task.dependencies), budget.maxAttempts,
              `${sessionId}:${task.stepIndex}`
            ]
          );
          created.push(result.rows[0]);
        }

        await appendEventWithClient(client, {
          sessionId,
          eventType: "PROJECT_TASKS_CREATED",
          actorType: "AGENT",
          actorId: "AGENT-AFRIAICOMMAND-001",
          details: {
            taskCount: created.length,
            totalTaskCount: existingCount + created.length
          }
        });
        return created;
      });
    },

      async claimTask({ sessionId, workerId, leaseSeconds = 120 }) {
        const worker=assertProjectText(workerId,"worker_id",256);
        if(!Number.isInteger(leaseSeconds)||leaseSeconds<1||leaseSeconds>PROJECT_SESSION_LIMITS.maxLeaseSeconds) throw new TypeError("AFRI_PROJECT_INVALID_LEASE");
        return transaction(async client=>{
          const sr=await client.query("SELECT id, status, budget FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",[sessionId]);
          const session=sr.rows?.[0]; if(!session) throw new Error("AFRI_PROJECT_SESSION_NOT_FOUND");
          if(session.status!=="RUNNING") throw new Error("AFRI_PROJECT_SESSION_NOT_CLAIMABLE");
          const blocked=await client.query(`UPDATE afri_agent_project_tasks t SET status='SKIPPED',updated_at=NOW()
            WHERE t.session_id=$1 AND t.status='PENDING' AND EXISTS(
              SELECT 1 FROM jsonb_array_elements_text(t.dependencies) dep
              LEFT JOIN afri_agent_project_tasks prior ON prior.session_id=t.session_id AND prior.step_index=dep.value::integer
              WHERE prior.id IS NULL OR prior.status IN ('FAILED','SKIPPED','CANCELLED','INTERRUPTED','NEEDS_RECONCILIATION'))
            RETURNING id,step_index`,[sessionId]);
          for(const task of blocked.rows??[]) await appendEventWithClient(client,{sessionId,eventType:"TASK_SKIPPED_DEPENDENCY_FAILED",actorType:"SYSTEM",actorId:"AFRI-AGENT-HARNESS",details:{taskId:task.id,stepIndex:task.step_index}});
          const exhausted=await client.query(`UPDATE afri_agent_project_tasks SET status='FAILED',updated_at=NOW()
            WHERE session_id=$1 AND status='PENDING' AND attempt_count>=max_attempts
            RETURNING id,session_id,step_index,attempt_count`,[sessionId]);
          for(const task of exhausted.rows??[]) await appendEventWithClient(client,{sessionId,eventType:"TASK_ATTEMPTS_EXHAUSTED",actorType:"SYSTEM",actorId:"AFRI-AGENT-HARNESS",details:{taskId:task.id,stepIndex:task.step_index,attemptCount:task.attempt_count}});
          const active=await client.query(`SELECT COUNT(*)::integer AS count FROM afri_agent_project_tasks
            WHERE session_id=$1 AND status IN ('CLAIMED','RUNNING') AND lease_until>NOW()`,[sessionId]);
          if(Number(active.rows?.[0]?.count??0)>=session.budget.maxConcurrency) return null;
          const result=await client.query(`WITH candidate AS (
            SELECT t.id FROM afri_agent_project_tasks t
            WHERE t.session_id=$1 AND t.status='PENDING' AND t.attempt_count<t.max_attempts
              AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements_text(t.dependencies) dep
                LEFT JOIN afri_agent_project_tasks prior ON prior.session_id=t.session_id AND prior.step_index=dep.value::integer
                WHERE prior.id IS NULL OR prior.status<>'COMPLETED')
            ORDER BY t.step_index FOR UPDATE SKIP LOCKED LIMIT 1)
            UPDATE afri_agent_project_tasks t SET status='CLAIMED',lease_owner=$2,
              lease_until=NOW()+($3*INTERVAL '1 second'),attempt_count=attempt_count+1,updated_at=NOW()
            FROM candidate WHERE t.id=candidate.id RETURNING t.*`,[sessionId,worker,leaseSeconds]);
          const task=result.rows?.[0]??null;
          if(task) await appendEventWithClient(client,{sessionId,eventType:"TASK_CLAIMED",actorType:"AGENT",actorId:worker,details:{taskId:task.id,stepIndex:task.step_index,attemptCount:task.attempt_count,leaseSeconds}});
          return task;
        });
      },

      async transitionTask({
      taskId, workerId, status, result: taskResult, approvalId
    }) {
      if (!TASK_STATUS_SET.has(status)) {
        throw new TypeError("AFRI_PROJECT_INVALID_TASK_STATUS");
      }
      const worker = assertProjectText(workerId, "worker_id", 256);
      const serializedResult = taskResult === undefined
        ? null
        : JSON.stringify(assertProjectJson(
            taskResult, "task_result", PROJECT_SESSION_LIMITS.resultBytes
          ));

      return transaction(async client => {
        const reference = await client.query(
          "SELECT session_id FROM afri_agent_project_tasks WHERE id=$1",
          [taskId]
        );
        const sessionId = reference.rows?.[0]?.session_id;
        if (!sessionId) throw new Error("AFRI_PROJECT_TASK_NOT_FOUND");

        await client.query(
          "SELECT id FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",
          [sessionId]
        );

        const selected = await client.query(
          "SELECT * FROM afri_agent_project_tasks WHERE id=$1 FOR UPDATE",
          [taskId]
        );
        const current = selected.rows?.[0];
        if (!current) throw new Error("AFRI_PROJECT_TASK_NOT_FOUND");

        if (current.lease_owner !== worker ||
            !TASK_TRANSITIONS[current.status]?.has(status)) {
          throw new Error("AFRI_PROJECT_INVALID_TASK_TRANSITION_OR_LEASE");
        }

        const updated = await client.query(
          `UPDATE afri_agent_project_tasks
           SET status=$3,
               result=COALESCE($4::jsonb,result),
               approval_id=COALESCE($5,approval_id),
               lease_owner=CASE WHEN $3='RUNNING' THEN lease_owner ELSE NULL END,
               lease_until=CASE WHEN $3='RUNNING' THEN lease_until ELSE NULL END,
               updated_at=NOW()
           WHERE id=$1 AND lease_owner=$2 AND status=$6
             AND lease_until > NOW()
           RETURNING *`,
          [taskId, worker, status, serializedResult, approvalId ?? null, current.status]
        );

        const task = updated.rows?.[0];
        if (!task) throw new Error("AFRI_PROJECT_TASK_LEASE_CONFLICT");
        if (status === "WAITING_APPROVAL" && !task.approval_id) {
          throw new Error("AFRI_PROJECT_APPROVAL_ID_REQUIRED");
        }

        await appendEventWithClient(client, {
          sessionId: task.session_id,
          eventType: "TASK_STATUS_CHANGED",
          actorType: "AGENT",
          actorId: worker,
          details: {
            taskId,
            stepIndex: task.step_index,
            previousStatus: current.status,
            status,
            approvalId: approvalId ?? null
          }
        });
        return task;
      });
    },

    // Call only after the approval authority consumes the matching approval.
      async resumeApprovedTask({taskId,approvalId,workerId,leaseSeconds=120}) {
        const worker=assertProjectText(workerId,"worker_id",256),approval=assertProjectText(approvalId,"approval_id",128);
        if(!Number.isInteger(leaseSeconds)||leaseSeconds<1||leaseSeconds>PROJECT_SESSION_LIMITS.maxLeaseSeconds) throw new TypeError("AFRI_PROJECT_INVALID_LEASE");
        return transaction(async client=>{
          const ref=await client.query("SELECT session_id FROM afri_agent_project_tasks WHERE id=$1",[taskId]);
          const sessionId=ref.rows?.[0]?.session_id; if(!sessionId) throw new Error("AFRI_PROJECT_TASK_NOT_FOUND");
          const sr=await client.query("SELECT id,budget FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",[sessionId]);
          const session=sr.rows?.[0]; if(!session) throw new Error("AFRI_PROJECT_SESSION_NOT_FOUND");
          const selected=await client.query("SELECT * FROM afri_agent_project_tasks WHERE id=$1 FOR UPDATE",[taskId]);
          const current=selected.rows?.[0]; if(!current) throw new Error("AFRI_PROJECT_TASK_NOT_FOUND");
          if(current.status!=="WAITING_APPROVAL"||current.approval_id!==approval) throw new Error("AFRI_PROJECT_APPROVAL_RESUME_MISMATCH");
          if(Number(current.attempt_count??0)>=Number(current.max_attempts??0)) throw new Error("AFRI_PROJECT_ATTEMPT_BUDGET_EXCEEDED");
          const active=await client.query(`SELECT COUNT(*)::integer AS count FROM afri_agent_project_tasks
            WHERE session_id=$1 AND status IN ('CLAIMED','RUNNING') AND lease_until>NOW()`,[sessionId]);
          if(Number(active.rows?.[0]?.count??0)>=session.budget.maxConcurrency) throw new Error("AFRI_PROJECT_CONCURRENCY_BUDGET_EXCEEDED");
          const updated=await client.query(`UPDATE afri_agent_project_tasks SET status='CLAIMED',lease_owner=$3,
            lease_until=NOW()+($4*INTERVAL '1 second'),updated_at=NOW()
            WHERE id=$1 AND status='WAITING_APPROVAL' AND approval_id=$2 RETURNING *`,[taskId,approval,worker,leaseSeconds]);
          const task=updated.rows?.[0]; if(!task) throw new Error("AFRI_PROJECT_APPROVAL_RESUME_CONFLICT");
          await appendEventWithClient(client,{sessionId:task.session_id,eventType:"TASK_RESUMED_AFTER_APPROVAL",actorType:"AGENT",actorId:worker,details:{taskId,stepIndex:task.step_index,approvalId:approval}});
          return task;
        });
      },

      async appendEvent(event) {
      return transaction(client => appendEventWithClient(client, event));
    },

    async listEvents({ sessionId, afterSequence = 0, limit = 100 }) {
      if (!Number.isInteger(afterSequence) || afterSequence < 0 ||
          !Number.isInteger(limit) || limit < 1 || limit > 500) {
        throw new TypeError("AFRI_PROJECT_INVALID_EVENT_QUERY");
      }
      const result = await pool.query(
        `SELECT * FROM afri_agent_project_events
         WHERE session_id=$1 AND sequence>$2
         ORDER BY sequence ASC LIMIT $3`,
        [sessionId, afterSequence, limit]
      );
      return result.rows ?? [];
    },

    async recoverExpiredLeases() {
      return transaction(async client => {
        const references = await client.query(
          `SELECT DISTINCT session_id
           FROM afri_agent_project_tasks
           WHERE status IN ('CLAIMED','RUNNING')
             AND lease_until IS NOT NULL AND lease_until < NOW()
           ORDER BY session_id`,
          []
        );
        const sessionIds = (references.rows ?? []).map(row => row.session_id);
        if (sessionIds.length === 0) return [];

        // Lock every affected session in deterministic order before locking tasks.
        for (const sessionId of sessionIds) {
          await client.query(
            "SELECT id FROM afri_agent_project_sessions WHERE id=$1 FOR UPDATE",
            [sessionId]
          );
        }

        const result = await client.query(
          `UPDATE afri_agent_project_tasks
           SET status='NEEDS_RECONCILIATION', lease_owner=NULL,
               lease_until=NULL, updated_at=NOW()
           WHERE session_id = ANY($1::uuid[])
             AND status IN ('CLAIMED','RUNNING')
             AND lease_until IS NOT NULL AND lease_until < NOW()
           RETURNING id, session_id, step_index`,
          [sessionIds]
        );

        for (const task of result.rows ?? []) {
          await appendEventWithClient(client, {
            sessionId: task.session_id,
            eventType: "TASK_LEASE_EXPIRED_RECONCILIATION_REQUIRED",
            actorType: "SYSTEM",
            actorId: "AFRI-AGENT-HARNESS",
            details: { taskId: task.id, stepIndex: task.step_index }
          });
        }
        return result.rows ?? [];
      });
    }
  });
}
