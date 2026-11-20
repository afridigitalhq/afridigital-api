import test from "node:test";
import assert from "node:assert/strict";
import { AfriAgentArtifactApprovalPostgresRepository } from "../AfriAgentArtifactApprovalPostgresRepository.js";

test("approval schema binds approvals to exact immutable artifact versions", async () => {
  let schema = "";
  const repository = new AfriAgentArtifactApprovalPostgresRepository({
    pool: {
      async query(sql) {
        schema = sql;
        return { rows: [] };
      }
    }
  });

  await repository.initialize();

  assert.match(schema, /FOREIGN KEY \(artifact_id, artifact_version\)/);
  assert.match(schema, /REFERENCES afri_agent_artifact_versions \(artifact_id, version\) ON DELETE RESTRICT/);
  assert.match(schema, /afri_artifact_approval_state_fields/);
  assert.match(schema, /rejection_reason IS NULL OR length\(rejection_reason\) <= 500/);
});

test("approval schema restricts identity changes and terminal-state transitions", async () => {
  let schema = "";
  const repository = new AfriAgentArtifactApprovalPostgresRepository({
    pool: {
      async query(sql) {
        schema = sql;
        return { rows: [] };
      }
    }
  });

  await repository.initialize();

  assert.match(schema, /CREATE OR REPLACE FUNCTION afri_artifact_approval_transition_guard/);
  assert.match(schema, /AFRI_ARTIFACT_APPROVAL_IDENTITY_IMMUTABLE/);
  assert.match(schema, /AFRI_ARTIFACT_APPROVAL_DELETE_FORBIDDEN/);
  assert.match(schema, /OLD\.status = 'PENDING' AND NEW\.status = 'APPROVED'/);
  assert.match(schema, /OLD\.status = 'PENDING' AND NEW\.status = 'REJECTED'/);
  assert.match(schema, /OLD\.status = 'APPROVED' AND NEW\.status = 'CONSUMED'/);
  assert.match(schema, /AFRI_ARTIFACT_APPROVAL_TRANSITION_FORBIDDEN/);
  assert.match(schema, /BEFORE UPDATE OR DELETE ON afri_agent_artifact_approvals/);
});
