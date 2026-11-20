import test from "node:test";
import assert from "node:assert/strict";
import a2aRoute from "./a2a.route.js";
import AfriAgentIdentityRegistry, { createAfriAgentIdentityRegistry } from "../../../platform/agent/identity/AfriAgentIdentityRegistry.js";

function createRouteHarness(options) {
  const handlers = new Map();
  const app = {
    get(path, handler) { handlers.set(`GET ${path}`, handler); },
    post(path, handler) { handlers.set(`POST ${path}`, handler); }
  };
  a2aRoute(app, options);
  return handlers;
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    set(name, value) { this.headers[name] = value; return this; },
    json(body) { this.body = body; return this; }
  };
}

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

test("public A2A discovery exposes only the four published agent keys", () => {
  const handlers = createRouteHarness();
  const response = createResponse();
  handlers.get("GET /api/a2a/agents")({}, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.service, "AfriDigital A2A Discovery");

  const keys = response.body.agents.map(agent => agent.key).sort();
  assert.deepEqual(keys, ["afriai", "afridebug", "afriforex", "afrirea"]);

  for (const key of ["afriaicommand", "afriaicoder", "afriintel"]) {
    assert.equal(keys.includes(key), false);
  }
  for (const agent of response.body.agents) {
    assert.ok(agent.agentCard.endsWith(
      `/.well-known/agents/${agent.key}/agent-card.json`
    ));
  }
});

test("default A2A agent-card endpoint remains intentionally unavailable", () => {
  const handlers = createRouteHarness();
  const response = createResponse();
  handlers.get("GET /.well-known/agent-card.json")({}, response);
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error.code, "AGENT_CARD_NOT_FOUND");
  assert.equal(response.body.error.message, "Agent card not publicly advertised");
});

test("public agent cards require an active matching published identity", () => {
  let builtKey = null;
  const handlers = createRouteHarness({
    agentCardBuilder: {
      build(key) {
        builtKey = key;
        return { name: "Test public agent card" };
      }
    }
  });
  const response = createResponse();
  handlers.get("GET /.well-known/agents/:agentKey/agent-card.json")(
    { params: { agentKey: "afriai" } },
    response
  );

  assert.equal(response.statusCode, 200);
  assert.equal(builtKey, "afriai");
  assert.equal(response.body.name, "Test public agent card");
});

test("agent cards are not generated for unpublished internal agents", () => {
  let builderCalled = false;
  const handlers = createRouteHarness({
    agentCardBuilder: {
      build() {
        builderCalled = true;
        return { name: "Must not be exposed" };
      }
    }
  });
  const response = createResponse();
  handlers.get("GET /.well-known/agents/:agentKey/agent-card.json")(
    { params: { agentKey: "afriaicommand" } },
    response
  );

  assert.equal(builderCalled, false);
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error.code, "AGENT_CARD_NOT_FOUND");
});

test("agent cards are denied when the published identity is inactive", () => {
  const identityRegistry = createAfriAgentIdentityRegistry();
  identityRegistry.initializeFromEnv();
  identityRegistry.transition("AGENT-BETA-001", "REVOKED");
  const handlers = createRouteHarness({ identityRegistry, agentCardBuilder: { build() { assert.fail("Card builder must not run for an inactive identity"); } } });
  const response = createResponse();
  handlers.get("GET /.well-known/agents/:agentKey/agent-card.json")({ params: { agentKey: "afriai" } }, response);
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error.code, "AGENT_CARD_NOT_FOUND");
});

test("agent cards are denied when the registered identity key does not match", () => {
  const identityRegistry = {
    initializeFromEnv() { AfriAgentIdentityRegistry.initializeFromEnv(); },
    get(id) { const identity = AfriAgentIdentityRegistry.get(id); return id === "AGENT-BETA-001" && identity ? { ...identity, key: "afriaicommand" } : identity; },
    list() { return AfriAgentIdentityRegistry.list(); }
  };
  const handlers = createRouteHarness({ identityRegistry, agentCardBuilder: { build() { assert.fail("Card builder must not run for a mismatched identity"); } } });
  const response = createResponse();
  handlers.get("GET /.well-known/agents/:agentKey/agent-card.json")({ params: { agentKey: "afriai" } }, response);
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error.code, "AGENT_CARD_NOT_FOUND");
});

test("detailed telemetry is denied by default", async () => {
  const handlers = createRouteHarness();
  const response = createResponse();
  await handlers.get("GET /api/a2a/telemetry")({
    get() { return "public-agent-header"; },
    query: {}
  }, response);
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error.code, "ADMIN_TELEMETRY_FORBIDDEN");
});

test("public A2A authentication cannot grant detailed telemetry access", async () => {
  let publicAuthCalled = false;
  const handlers = createRouteHarness({
    requestAuth: {
      async verify() {
        publicAuthCalled = true;
        return { verified: true };
      },
      async isReady() { return true; }
    }
  });
  const response = createResponse();
  await handlers.get("GET /api/a2a/telemetry")({
    get() { return "valid-public-agent-header"; },
    query: {}
  }, response);
  assert.equal(publicAuthCalled, false);
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error.code, "ADMIN_TELEMETRY_FORBIDDEN");
});

test("injected administrator authorization can access detailed telemetry", async () => {
  const request = { query: { agentId: "AGENT-BETA-001" } };
  let received = null;
  const handlers = createRouteHarness({
    authorizeTelemetryAdmin: async req => {
      received = req;
      return true;
    }
  });
  const response = createResponse();
  await handlers.get("GET /api/a2a/telemetry")(request, response);
  assert.equal(received, request);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.service, "AfriDigital A2A Telemetry");
  assert.ok(Array.isArray(response.body.agents));
  assert.ok(Array.isArray(response.body.activity));
});

test("detailed telemetry denies false or failing administrator authorization", async () => {
  for (const authorizeTelemetryAdmin of [
    async () => false,
    async () => { throw new Error("authorization provider unavailable"); }
  ]) {
    const handlers = createRouteHarness({ authorizeTelemetryAdmin });
    const response = createResponse();
    await handlers.get("GET /api/a2a/telemetry")({ query: {} }, response);
    assert.equal(response.statusCode, 403);
    assert.equal(response.body.error.code, "ADMIN_TELEMETRY_FORBIDDEN");
    assert.equal(Object.hasOwn(response.body, "agents"), false);
    assert.equal(Object.hasOwn(response.body, "activity"), false);
  }
});

test("public dashboard telemetry exposes aggregate counts only", () => {
  const handlers = createRouteHarness();
  const handler = handlers.get("GET /api/a2a/dashboard-telemetry");

  assert.equal(typeof handler, "function");

  const response = createResponse();
  handler({}, response);

  assert.equal(response.statusCode, 200);
  assert.equal(
    response.body.service,
    "AfriDigital A2A Dashboard Telemetry"
  );
  assert.equal(typeof response.body.generatedAt, "number");

  assert.deepEqual(
    Object.keys(response.body.stats).sort(),
    [
      "a2aCalls",
      "completed",
      "failed",
      "operations",
      "processing",
      "successful"
    ]
  );

  for (const value of Object.values(response.body.stats)) {
    assert.equal(Number.isFinite(value), true);
    assert.ok(value >= 0);
  }

  assert.equal(Object.hasOwn(response.body, "agents"), false);
  assert.equal(Object.hasOwn(response.body, "activity"), false);
});


test("protected A2A routes bind verification to their exact POST method and path", async () => {
  const cases = [
    ["POST /message:send", "/message:send"],
    ["POST /api/a2a/tasks", "/api/a2a/tasks"]
  ];

  for (const [routeKey, expectedPath] of cases) {
    let verificationInput;
    const requestAuth = {
      async verify(input) {
        verificationInput = input;
        return { verified: false, code: "A2A_INVALID_SIGNATURE" };
      },
      async isReady() { return true; }
    };
    const handler = createRouteHarness({ requestAuth }).get(routeKey);
    assert.equal(typeof handler, "function", `missing handler: ${routeKey}`);
    const response = createResponse();
    await handler({ get() { return "route-test-header"; }, query: {}, body: {} }, response);
    assert.equal(response.statusCode, 401, routeKey);
    assert.equal(verificationInput.method, "POST", routeKey);
    assert.equal(verificationInput.path, expectedPath, routeKey);
    assert.deepEqual(verificationInput.body, {}, routeKey);
  }
});

test("all protected A2A routes return 503 when replay protection is unavailable", async () => {
  const requestAuth = {
    async verify() {
      return {
        verified: false,
        code: "A2A_REPLAY_PROTECTION_UNAVAILABLE"
      };
    },
    async isReady() {
      return false;
    }
  };

  const cases = [
    ["POST /message:send", "post"],
    ["POST /api/a2a/tasks", "post"]
  ];

  for (const [routeKey, method] of cases) {
    const handlers = createRouteHarness({ requestAuth });
    const handler = handlers.get(routeKey);
    assert.equal(typeof handler, "function", `missing handler: ${routeKey}`);

    const response = createResponse();
    const request = {
      get() { return "route-test-header"; },
      query: {},
      body: {}
    };

    await handler(request, response);

    assert.equal(response.statusCode, 503, routeKey);
    assert.equal(
      response.body.error.code,
      "A2A_REPLAY_PROTECTION_UNAVAILABLE",
      routeKey
    );
  }
});
