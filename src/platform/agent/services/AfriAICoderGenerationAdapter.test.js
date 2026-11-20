import test from "node:test";
import assert from "node:assert/strict";
import {
  createAfriAICoderGenerationAdapter,
  validateAfriAICoderProposal
} from "./AfriAICoderGenerationAdapter.js";

const agentId="AGENT-AFRIAICODER-001";

const context={
  executionChannel:"INTERNAL_ADMIN",
  paymentPolicy:"NO_AUTOMATIC_PAYMENT",
  taskId:"coder-test-001",
  sourceAgentId:"AGENT-AFRIAICOMMAND-001"
};

const validProposal={
  status:"PATCH_PROPOSAL_READY",
  summary:"Add bounded URL validation.",
  changes:[{
    path:"modules/example/Validator.js",
    operation:"create",
    content:"export function validateUrl(value){return Boolean(value)}\n"
  }]
};

function gatewayReturning(content){
  return {
    async generate(request){
      return {
        content,
        provider:"test-provider",
        model:"test-model",
        profile:request.profile,
        latencyMs:10
      };
    }
  };
}

function execute(adapter,overrides={}){
  return adapter.execute({
    agentId,
    capability:"engineering.backend",
    task:{objective:"Implement URL validation.",dependencyResults:[]},
    context,
    ...overrides
  });
}

test("generates a coding-profile patch proposal through the shared gateway",async()=>{
  let received;
  const adapter=createAfriAICoderGenerationAdapter({
    gateway:{
      async generate(request){
        received=request;
        return {
          content:JSON.stringify(validProposal),
          provider:"mock",
          profile:request.profile
        };
      }
    }
  });

  const result=await execute(adapter);

  assert.equal(received.profile,"coding");
  assert.equal(received.options.responseFormat,"json");
  assert.match(received.prompt,/reviewable code-change proposal only/);
  assert.equal(result.status,"PATCH_PROPOSAL_READY");
  assert.equal(result.changes[0].path,"modules/example/Validator.js");
  assert.equal(result.execution.applied,false);
  assert.equal(result.execution.commandsExecuted,false);
  assert.equal(result.execution.deploymentPerformed,false);
});

test("accepts a JSON response inside a fenced code block",async()=>{
  const adapter=createAfriAICoderGenerationAdapter({
    gateway:gatewayReturning("```json\n"+JSON.stringify(validProposal)+"\n```")
  });

  const result=await execute(adapter);
  assert.equal(result.status,"PATCH_PROPOSAL_READY");
});

test("rejects malformed model JSON",async()=>{
  const adapter=createAfriAICoderGenerationAdapter({
    gateway:gatewayReturning("{invalid")
  });

  await assert.rejects(
    execute(adapter),
    /AFRIAICODER_MODEL_RESPONSE_JSON_INVALID/
  );
});

test("rejects unsafe paths and traversal",()=>{
  for(const path of [
    "../outside.js",
    "/etc/passwd",
    "src/../../outside.js",
    ".git/config",
    "node_modules/pkg/index.js",
    ".env",
    "keys/private.pem",
    "src/private-key.js"
  ]){
    assert.throws(
      ()=>validateAfriAICoderProposal({
        ...validProposal,
        changes:[{...validProposal.changes[0],path}]
      }),
      /AFRIAICODER_CHANGE_PATH_FORBIDDEN/
    );
  }
});

test("rejects duplicate paths and unsupported operations",()=>{
  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      changes:[validProposal.changes[0],validProposal.changes[0]]
    }),
    /AFRIAICODER_CHANGE_PATH_DUPLICATE/
  );

  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      changes:[{...validProposal.changes[0],operation:"delete"}]
    }),
    /AFRIAICODER_CHANGE_OPERATION_FORBIDDEN/
  );
});

test("rejects command fields and additional model instructions",()=>{
  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      command:"rm -rf ."
    }),
    /AFRIAICODER_PROPOSAL_FIELDS_FORBIDDEN/
  );

  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      changes:[{...validProposal.changes[0],shell:"npm test"}]
    }),
    /AFRIAICODER_CHANGE_FIELDS_FORBIDDEN/
  );
});

test("enforces file count and content size limits",()=>{
  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      changes:Array(9).fill(validProposal.changes[0])
    }),
    /AFRIAICODER_PROPOSAL_CHANGES_INVALID/
  );

  assert.throws(
    ()=>validateAfriAICoderProposal({
      ...validProposal,
      changes:[{...validProposal.changes[0],content:"x".repeat(65537)}]
    }),
    /AFRIAICODER_CHANGE_FILE_TOO_LARGE/
  );
});

test("rejects forged identity, unauthorized capability and execution policy",async()=>{
  const adapter=createAfriAICoderGenerationAdapter({
    gateway:gatewayReturning(JSON.stringify(validProposal))
  });

  await assert.rejects(
    execute(adapter,{agentId:"AGENT-ATTACKER-001"}),
    /AFRIAICODER_ADAPTER_IDENTITY_INVALID/
  );

  await assert.rejects(
    execute(adapter,{capability:"wallet.transfer"}),
    /AFRIAICODER_ADAPTER_CAPABILITY_INVALID/
  );

  await assert.rejects(
    execute(adapter,{context:{...context,paymentPolicy:"AUTOMATIC_PAYMENT"}}),
    /AFRIAICODER_ADAPTER_EXECUTION_POLICY_INVALID/
  );
});


test("rejects oversized raw model responses before JSON parsing",async()=>{
  const adapter=createAfriAICoderGenerationAdapter({gateway:gatewayReturning("x".repeat(1048577))});
  await assert.rejects(execute(adapter),/AFRIAICODER_MODEL_RESPONSE_TOO_LARGE/);
});

test("rejects every AfriAICoder capability except engineering.backend",async()=>{
  const adapter=createAfriAICoderGenerationAdapter({
    gateway:gatewayReturning(JSON.stringify(validProposal))
  });

  for(const capability of [
    "engineering.web",
    "engineering.android",
    "engineering.ai",
    "engineering.devops",
    "engineering.blockchain",
    "engineering.security",
    "engineering.architecture"
  ]){
    await assert.rejects(
      execute(adapter,{capability}),
      /AFRIAICODER_ADAPTER_CAPABILITY_INVALID/
    );
  }
});
