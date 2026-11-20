import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import AfriA2ATaskRuntime from "./AfriA2ATaskRuntime.js";
import { A2A_ERRORS } from "./AfriA2AErrors.js";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriAgentsEconomyRegistry from "../economy/AfriAgentsEconomyRegistry.js";
import AfriAgentsEconomyPaymentStore from "../economy/AfriAgentsEconomyPaymentStore.js";
import AfriAgentsEconomyPaymentRuntime from "../economy/AfriAgentsEconomyPaymentRuntime.js";
import AfriAgentsEconomySettlementRuntime from "../economy/AfriAgentsEconomySettlementRuntime.js";
import AfriA2AUsageMeter from "../metering/AfriA2AUsageMeter.js";

let sequence = 0;
let fixture;
let payments;
let usage;

const originals = {};

beforeEach(() => {
  sequence += 1;

  payments = new Map();
  usage = new Map();

  originals.storeGet = AfriAgentsEconomyPaymentStore.get;
  originals.storeList = AfriAgentsEconomyPaymentStore.list;
  originals.storeSave = AfriAgentsEconomyPaymentStore.save;
  originals.getService = AfriAgentsEconomyRegistry.getService;
  originals.usageStart = AfriA2AUsageMeter.start;
  originals.usageUpdate = AfriA2AUsageMeter.update;
  originals.settle = AfriAgentsEconomySettlementRuntime.settle;

  AfriAgentsEconomyPaymentStore.get = id => payments.get(id) || null;
  AfriAgentsEconomyPaymentStore.list = () => [...payments.values()];
  AfriAgentsEconomyPaymentStore.save = payment => {
    payments.set(payment.paymentId, payment);
    return payment;
  };

  fixture = {
    payerId: `TEST-PAYER-${sequence}`,
    agentId: `TEST-PAYEE-${sequence}`,
    capabilityId: `test.execute.${sequence}`,
    taskId: `TEST-TASK-${sequence}`,
    serviceAvailable: true,
    handler: async payload => ({ received: payload })
  };

  AfriAgentIdentityRegistry.register({
    id: fixture.payerId,
    name: "Test Payer",
    capabilities: []
  });

  AfriAgentIdentityRegistry.register({
    id: fixture.agentId,
    name: "Test Payee",
    capabilities: [fixture.capabilityId]
  });

  AfriAgentCapabilityRegistry.register({
    id: fixture.capabilityId,
    service: "TaskRuntimeTest",
    handler: (...args) => fixture.handler(...args),
    enabled: true
  });

  AfriAgentsEconomyRegistry.getService = ({ agentId, capability }) => {
    if (
      fixture.serviceAvailable &&
      agentId === fixture.agentId &&
      capability === fixture.capabilityId
    ) {
      return {
        agentId,
        capability,
        service: "TaskRuntimeTest",
        status: "ACTIVE",
        pricing: {
          model: "FIXED",
          amountUSD: 0.55
        }
      };
    }

    return null;
  };

  AfriA2AUsageMeter.start = input => {
    const record = {
      ...input,
      id: `TEST-USAGE-${sequence}`,
      status: "PROCESSING"
    };
    usage.set(record.id, record);
    return record;
  };

  AfriA2AUsageMeter.update = (id, patch) => {
    const record = usage.get(id);
    if (!record) return null;
    Object.assign(record, patch);
    return record;
  };
});

afterEach(() => {
  AfriAgentsEconomyPaymentStore.get = originals.storeGet;
  AfriAgentsEconomyPaymentStore.list = originals.storeList;
  AfriAgentsEconomyPaymentStore.save = originals.storeSave;
  AfriAgentsEconomyRegistry.getService = originals.getService;
  AfriA2AUsageMeter.start = originals.usageStart;
  AfriA2AUsageMeter.update = originals.usageUpdate;
  AfriAgentsEconomySettlementRuntime.settle = originals.settle;
});

function execute(overrides = {}) {
  return AfriA2ATaskRuntime.execute({
    taskId: fixture.taskId,
    sourceAgentId: fixture.payerId,
    agentId: fixture.agentId,
    capability: fixture.capabilityId,
    payload: { message: "integration test" },
    ...overrides
  });
}

test("rejects an unknown target agent before creating payment", async () => {
  await assert.rejects(
    () => execute({ agentId: "UNKNOWN-AGENT" }),
    { code: A2A_ERRORS.AGENT_NOT_FOUND }
  );

  assert.equal(payments.size, 0);
  assert.equal(usage.size, 0);
});

test("rejects an inactive target agent", async () => {
  AfriAgentIdentityRegistry.revoke(fixture.agentId);

  await assert.rejects(
    () => execute(),
    { code: A2A_ERRORS.AGENT_REVOKED }
  );

  assert.equal(payments.size, 0);
});

test("rejects a disabled capability", async () => {
  AfriAgentCapabilityRegistry.disable(fixture.capabilityId);

  await assert.rejects(
    () => execute(),
    { code: A2A_ERRORS.CAPABILITY_DISABLED }
  );

  assert.equal(payments.size, 0);
});

test("rejects a capability not assigned to the target agent", async () => {
  const agent = AfriAgentIdentityRegistry.get(fixture.agentId);
  AfriAgentIdentityRegistry.updateCapabilities(fixture.agentId, []);

  await assert.rejects(
    () => execute(),
    { code: A2A_ERRORS.CAPABILITY_FORBIDDEN }
  );

  assert.equal(payments.size, 0);
});

test("blocks payment-backed capability execution while payments are disabled", async () => {
  let handlerCalls = 0;
  fixture.handler = async () => {
    handlerCalls += 1;
    return { unexpected: true };
  };

  await assert.rejects(
    () => execute(),
    {
      code: "AFRI_ECONOMY_PAYMENTS_DISABLED",
      message: "AfriAgents Economy payment operation disabled by policy: createObligation"
    }
  );

  assert.equal(handlerCalls, 0);
  assert.equal(payments.size, 0);
  assert.equal(usage.size, 0);
});
