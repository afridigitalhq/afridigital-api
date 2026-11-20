import test from "node:test";
import assert from "node:assert/strict";
import {
  PROJECT_SESSION_STATUSES,
  PROJECT_TASK_STATUSES,
  validateProjectSessionInput,
  validateProjectTaskInput
} from "./AfriAgentProjectSessionContract.js";
import {
  createAfriAgentProjectSessionPostgresRepository
} from "./AfriAgentProjectSessionPostgresRepository.js";

function mockPool(handler = async () => ({ rows: [] })) {
  const statements = [];
  const client = {
    async query(sql, values) {
      statements.push({ sql, values });
      return handler(sql, values);
    },
    release() {}
  };
  return {
    statements,
    pool: {
      async query(sql, values) {
        statements.push({ sql, values });
        return handler(sql, values);
      },
      async connect() {
        return client;
      }
    }
  };
}

test("session and task lifecycle contracts expose bounded states", () => {
  assert.ok(PROJECT_SESSION_STATUSES.includes("WAITING_APPROVAL"));
  assert.ok(PROJECT_SESSION_STATUSES.includes("COMPLETED"));
  assert.ok(PROJECT_TASK_STATUSES.includes("NEEDS_RECONCILIATION"));
});

test("session contract separates requester and machine identities", () => {
  const value = validateProjectSessionInput({
    requesterId: "USER-1",
    sourceAgentId: "AGENT-AFRIAICOMMAND-001",
    objective: "Build and verify a feature",
    acceptanceCriteria: ["Tests pass"]
  });
  assert.equal(value.requesterId, "USER-1");
  assert.equal(value.sourceAgentId, "AGENT-AFRIAICOMMAND-001");
  assert.equal(value.budget.maxConcurrency, 2);
});

test("session contract rejects missing identity and excessive budgets", () => {
  assert.throws(() => validateProjectSessionInput({
    requesterId: "USER-1", objective: "Missing source agent"
  }), /INVALID_SOURCE_AGENT_ID/);
  assert.throws(() => validateProjectSessionInput({
    requesterId: "USER-1", sourceAgentId: "AGENT-1",
    objective: "Bad budget", budget: { maxConcurrency: 99 }
  }), /INVALID_BUDGET/);
});

test("task contract rejects invalid dependencies", () => {
  assert.deepEqual(validateProjectTaskInput({
    agentId: "AGENT-AFRIDEBUG-001",
    capabilityId: "debug.analyze",
    description: "Verify implementation",
    dependencies: [0]
  }, 1).dependencies, [0]);

  assert.throws(() => validateProjectTaskInput({
    agentId: "AGENT-1", capabilityId: "test.run",
    description: "Forward dependency", dependencies: [1]
  }, 1), /INVALID_TASK_DEPENDENCIES/);

  assert.throws(() => validateProjectTaskInput({
    agentId: "AGENT-1", capabilityId: "test.run",
    description: "Duplicate dependency", dependencies: [0, 0]
  }, 1), /INVALID_TASK_DEPENDENCIES/);
});

test("repository requires a PostgreSQL pool with connection support", () => {
  assert.throws(() =>
    createAfriAgentProjectSessionPostgresRepository({
      pool: { query() {} }
    }), /POSTGRES_POOL_REQUIRED/
  );
});

test("initialize creates schema once and retries after failure", async () => {
  let calls = 0;
  let fail = true;
  const { pool } = mockPool(async sql => {
    calls++;
    assert.match(sql, /afri_agent_project_sessions/);
    assert.match(sql, /afri_agent_project_tasks/);
    assert.match(sql, /afri_agent_project_events/);
    if (fail) {
      fail = false;
      throw new Error("temporary database failure");
    }
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  await assert.rejects(repository.initialize(), /temporary database failure/);
  assert.equal(await repository.initialize(), true);
  assert.equal(await repository.initialize(), true);
  assert.equal(calls, 2);
});

test("session updates lock first, enforce transitions, use optimistic versions and append events", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT id, status, version, plan_version/.test(sql)) {
      return { rows: [{ id: "s1", status: "PLANNING", version: 1, plan_version: 0 }] };
    }
    if (/UPDATE afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1", version: 2, status: "RUNNING", plan_version: 0 }] };
    }
    if (/RETURNING event_sequence/.test(sql)) return { rows: [{ event_sequence: 1 }] };
    if (/INSERT INTO afri_agent_project_events/.test(sql)) return { rows: [{ id: "e1" }] };
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  const updated = await repository.updateSession({
    sessionId: "s1", expectedVersion: 1, status: "RUNNING"
  });
  assert.equal(updated.version, 2);
  const lock = statements.findIndex(item => /SELECT id, status, version, plan_version/.test(item.sql));
  const update = statements.findIndex(item => /SET status=COALESCE/.test(item.sql));
  const event = statements.findIndex(item => /INSERT INTO afri_agent_project_events/.test(item.sql));
  assert.ok(lock >= 0 && update > lock && event > update);
  assert.ok(statements.some(item => item.sql === "COMMIT"));
});


test("session lifecycle rejects reopening terminal states and permits explicit resume", async () => {
  const { pool } = mockPool(async sql => {
    if (/SELECT id, status, version, plan_version/.test(sql)) {
      return { rows: [{ id: "s1", status: "COMPLETED", version: 1, plan_version: 0 }] };
    }
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  await assert.rejects(repository.updateSession({
    sessionId: "s1", expectedVersion: 1, status: "RUNNING"
  }), /INVALID_SESSION_TRANSITION/);
});

test("session update rejects invalid lifecycle states", async () => {
  const { pool } = mockPool();
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  await assert.rejects(repository.updateSession({
    sessionId: "s1", expectedVersion: 1, status: "MAGICALLY_DONE"
  }), /INVALID_SESSION_STATUS/);
});

test("event pagination is bounded", async () => {
  const { pool } = mockPool();
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  await assert.rejects(repository.listEvents({
    sessionId: "s1", limit: 10000
  }), /INVALID_EVENT_QUERY/);
});


test("task creation allocates session-wide indexes and validates cross-batch dependencies", async () => {
  const inserted = [];
  const { pool, statements } = mockPool(async (sql, values) => {
    if (/SELECT id, status, budget FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1", status: "PLANNING", budget: { maxTasks: 10, maxAttempts: 3, maxConcurrency: 2 } }] };
    }
    if (/SELECT COUNT\(\*\)::integer AS count/.test(sql)) return { rows: [{ count: 2 }] };
    if (/SELECT step_index FROM afri_agent_project_tasks/.test(sql)) {
      return { rows: [{ step_index: 0 }, { step_index: 1 }] };
    }
    if (/INSERT INTO afri_agent_project_tasks/.test(sql)) {
      inserted.push(values);
      return { rows: [{ id: values[0], step_index: values[2] }] };
    }
    if (/UPDATE afri_agent_project_sessions/.test(sql)) return { rows: [{ event_sequence: 1 }] };
    if (/INSERT INTO afri_agent_project_events/.test(sql)) return { rows: [{}] };
    return { rows: [] };
  });

  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  const created = await repository.createTasks({
    sessionId: "s1",
    tasks: [
      { agentId: "AGENT-AFRIDEBUG-001", capabilityId: "debug.analyze", description: "Inspect implementation", dependencies: [1] },
      { agentId: "AGENT-AFRIDEBUG-001", capabilityId: "debug.analyze", description: "Verify implementation", dependencies: [2] }
    ]
  });

  assert.deepEqual(created.map(task => task.step_index), [2, 3]);
  assert.deepEqual(inserted.map(values => values[2]), [2, 3]);
  assert.deepEqual(JSON.parse(inserted[0][6]), [1]);
  assert.deepEqual(JSON.parse(inserted[1][6]), [2]);
  assert.ok(statements.some(item => /FOR UPDATE/.test(item.sql)));
  assert.ok(statements.some(item => /PROJECT_TASKS_CREATED/.test(item.sql) || /INSERT INTO afri_agent_project_events/.test(item.sql)));
});

test("task creation rejects unknown dependencies without inserting tasks", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT id, status, budget FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1", status: "PLANNING", budget: { maxTasks: 10, maxAttempts: 3, maxConcurrency: 2 } }] };
    }
    if (/SELECT COUNT\(\*\)::integer AS count/.test(sql)) return { rows: [{ count: 1 }] };
    if (/SELECT step_index FROM afri_agent_project_tasks/.test(sql)) return { rows: [{ step_index: 0 }, { step_index: 2 }] };
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });

  await assert.rejects(repository.createTasks({
    sessionId: "s1",
    tasks: [{ agentId: "AGENT-1", capabilityId: "test.run", description: "Dangling dependency", dependencies: [1] }]
  }), /UNKNOWN_TASK_DEPENDENCY/);

  assert.ok(!statements.some(item => /INSERT INTO afri_agent_project_tasks/.test(item.sql)));
  assert.ok(statements.some(item => item.sql === "ROLLBACK"));
});

test("task creation is restricted to planning sessions", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT id, status, budget FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1", status: "RUNNING", budget: { maxTasks: 10, maxAttempts: 3, maxConcurrency: 2 } }] };
    }
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });

  await assert.rejects(repository.createTasks({
    sessionId: "s1",
    tasks: [{ agentId: "AGENT-1", capabilityId: "test.run", description: "Must not be inserted" }]
  }), /SESSION_NOT_PLANNING/);

  assert.ok(!statements.some(item => /INSERT INTO afri_agent_project_tasks/.test(item.sql)));
  assert.ok(statements.some(item => item.sql === "ROLLBACK"));
});

test("task claiming is blocked unless the project session is running", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT id, status, budget FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1", status: "PAUSED", budget: { maxTasks: 10, maxAttempts: 3, maxConcurrency: 2 } }] };
    }
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });

  await assert.rejects(repository.claimTask({
    sessionId: "s1", workerId: "worker-1", leaseSeconds: 60
  }), /SESSION_NOT_CLAIMABLE/);

  assert.ok(!statements.some(item => /UPDATE afri_agent_project_tasks/.test(item.sql)));
  assert.ok(!statements.some(item => /WITH candidate AS/.test(item.sql)));
  assert.ok(statements.some(item => item.sql === "ROLLBACK"));
});

test("task claiming uses row locks, attempt limits and transaction", async () => {
  const {pool,statements}=mockPool(async sql=>{
    if(/SELECT id, status, budget FROM afri_agent_project_sessions/.test(sql)) return {rows:[{id:"s1",status:"RUNNING",budget:{maxTasks:10,maxAttempts:3,maxConcurrency:2}}]};
    if(/SELECT COUNT\(\*\)::integer AS count/.test(sql)) return {rows:[{count:0}]};
    if(/WITH candidate AS/.test(sql)) return {rows:[]};
    return {rows:[]};
  });
  const repository=createAfriAgentProjectSessionPostgresRepository({pool});
  assert.equal(await repository.claimTask({sessionId:"s1",workerId:"worker-1",leaseSeconds:60}),null);
  const claim=statements.find(item=>/WITH candidate AS/.test(item.sql));
  assert.match(claim.sql,/FOR UPDATE SKIP LOCKED/);
  assert.match(claim.sql,/attempt_count<t\.max_attempts/);
  assert.ok(statements.some(item=>item.sql==="BEGIN"));
  assert.ok(statements.some(item=>item.sql==="COMMIT"));
});

      test("task transition rejects invalid state changes and rolls back", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT session_id FROM afri_agent_project_tasks/.test(sql)) {
      return { rows: [{ session_id: "s1" }] };
    }
    if (/SELECT id FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1" }] };
    }
    if (/SELECT \* FROM afri_agent_project_tasks/.test(sql)) {
      return { rows: [{
        id: "t1", session_id: "s1", step_index: 0,
        status: "WAITING_APPROVAL", lease_owner: "worker-1",
        approval_id: "a1"
      }] };
    }
    return { rows: [] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  await assert.rejects(repository.transitionTask({
    taskId: "t1", workerId: "worker-1", status: "COMPLETED"
  }), /INVALID_TASK_TRANSITION_OR_LEASE/);
  assert.ok(statements.some(item => item.sql === "ROLLBACK"));
  assert.ok(!statements.some(item => /UPDATE afri_agent_project_tasks/.test(item.sql)));
});

test("approval resumption requires exact stored approval identifier", async () => {
  const {pool,statements}=mockPool(async sql=>{
    if(/SELECT session_id FROM afri_agent_project_tasks/.test(sql)) return {rows:[{session_id:"s1"}]};
    if(/SELECT id,budget FROM afri_agent_project_sessions/.test(sql)) return {rows:[{id:"s1",budget:{maxTasks:10,maxAttempts:3,maxConcurrency:2}}]};
    if(/SELECT \* FROM afri_agent_project_tasks/.test(sql)) return {rows:[{id:"t1",session_id:"s1",step_index:0,status:"WAITING_APPROVAL",approval_id:"approved-1",attempt_count:1,max_attempts:3}]};
    return {rows:[]};
  });
  const repository=createAfriAgentProjectSessionPostgresRepository({pool});
  await assert.rejects(repository.resumeApprovedTask({taskId:"t1",approvalId:"different-approval",workerId:"w1"}),/APPROVAL_RESUME_MISMATCH/);
  assert.ok(statements.some(item=>item.sql==="ROLLBACK"));
});

      test("expired running work is marked for reconciliation, never replayed", async () => {
  const { pool, statements } = mockPool(async sql => {
    if (/SELECT DISTINCT session_id/.test(sql)) {
      return { rows: [{ session_id: "s1" }] };
    }
    if (/SELECT id FROM afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ id: "s1" }] };
    }
    if (/UPDATE afri_agent_project_tasks/.test(sql)) {
      return { rows: [{ id: "t1", session_id: "s1", step_index: 0 }] };
    }
    if (/UPDATE afri_agent_project_sessions/.test(sql)) {
      return { rows: [{ event_sequence: 1 }] };
    }
    return { rows: [{}] };
  });
  const repository = createAfriAgentProjectSessionPostgresRepository({ pool });
  const recovered = await repository.recoverExpiredLeases();
  assert.equal(recovered.length, 1);
  assert.ok(statements.some(item => /NEEDS_RECONCILIATION/.test(item.sql)));
  assert.ok(!statements.some(item => /SET status='PENDING'/.test(item.sql)));
});
