import test from "node:test";
import assert from "node:assert/strict";

import AfriA2AAuthorization, { createAfriA2AAuthorization } from "./AfriA2AAuthorization.js";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentProfiles from "../identity/AfriAgentProfiles.js";
import { A2A_ERRORS } from "../a2a/AfriA2AErrors.js";

AfriAgentIdentityRegistry.initializeFromEnv();

const publicSource = AfriAgentProfiles.afriai.id;
const publicTarget = AfriAgentProfiles.afridebug.id;

test("allows external authorization between published active identities", () => {
  const result = AfriA2AAuthorization.authorize({
    sourceAgentId: publicSource,
    targetAgentId: publicTarget,
    capability: "debug.analyze",
    requestOrigin: "EXTERNAL"
  });

  assert.equal(result.authorized, true);
  assert.equal(result.sourceAgentId, publicSource);
  assert.equal(result.targetAgentId, publicTarget);
});

test("rejects an unpublished internal target from external access", () => {
  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: publicSource,
      targetAgentId: AfriAgentProfiles.afriaicommand.id,
      requestOrigin: "EXTERNAL"
    }),
    { code: A2A_ERRORS.AUTHORIZATION_FORBIDDEN }
  );
});

test("rejects an unpublished internal source from external access", () => {
  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: AfriAgentProfiles.afriaicommand.id,
      targetAgentId: publicTarget,
      requestOrigin: "EXTERNAL"
    }),
    { code: A2A_ERRORS.AUTHORIZATION_FORBIDDEN }
  );
});

test("rejects an external source whose registered key does not match its profile", () => {
  const identityRegistry = { get(id) { const identity = AfriAgentIdentityRegistry.get(id); return id === publicSource && identity ? { ...identity, key: "afriaicommand" } : identity; } };
  const authorization = createAfriA2AAuthorization({ identityRegistry });
  assert.throws(() => authorization.authorize({ sourceAgentId: publicSource, targetAgentId: publicTarget, requestOrigin: "EXTERNAL" }), { code: A2A_ERRORS.AUTHORIZATION_FORBIDDEN });
});

test("rejects missing external source identities", () => {
  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: "UNKNOWN-SOURCE",
      targetAgentId: publicTarget,
      requestOrigin: "EXTERNAL"
    }),
    { code: A2A_ERRORS.AGENT_NOT_FOUND }
  );
});

test("rejects inactive external source identities", () => {
  const identityRegistry = { get(id) { const identity = AfriAgentIdentityRegistry.get(id); return id === publicSource && identity ? { ...identity, status: "REVOKED" } : identity; } };
  const authorization = createAfriA2AAuthorization({ identityRegistry });
  assert.throws(() => authorization.authorize({ sourceAgentId: publicSource, targetAgentId: publicTarget, requestOrigin: "EXTERNAL" }), { code: A2A_ERRORS.AGENT_REVOKED });
});

test("rejects unsupported request origins", () => {
  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: publicSource,
      targetAgentId: publicTarget,
      requestOrigin: "UNKNOWN"
    }),
    { code: A2A_ERRORS.INVALID_REQUEST }
  );
});

test("preserves internal same-organization agent authorization", () => {
  const source = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-SOURCE",
    key: "test-internal-source",
    trustDomain: "INTERNAL",
    organizationId: "afridigital"
  });

  const target = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-TARGET",
    key: "test-internal-target",
    trustDomain: "INTERNAL",
    organizationId: "afridigital"
  });

  const result = AfriA2AAuthorization.authorize({
    sourceAgentId: source.id,
    targetAgentId: target.id,
    requestOrigin: "INTERNAL"
  });

  assert.equal(result.authorized, true);
});

test("rejects internal agents from different organizations", () => {
  const source = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-ORG-A",
    trustDomain: "INTERNAL",
    organizationId: "org-a"
  });

  const target = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-ORG-B",
    trustDomain: "INTERNAL",
    organizationId: "org-b"
  });

  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: source.id,
      targetAgentId: target.id,
      requestOrigin: "INTERNAL"
    }),
    { code: A2A_ERRORS.AUTHORIZATION_FORBIDDEN }
  );
});

test("rejects internal execution across trust domains", () => {
  const source = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-TRUST-SOURCE",
    trustDomain: "EXTERNAL",
    organizationId: "afridigital"
  });

  const target = AfriAgentIdentityRegistry.register({
    id: "TEST-INTERNAL-TRUST-TARGET",
    trustDomain: "INTERNAL",
    organizationId: "afridigital"
  });

  assert.throws(
    () => AfriA2AAuthorization.authorize({
      sourceAgentId: source.id,
      targetAgentId: target.id,
      requestOrigin: "INTERNAL"
    }),
    { code: A2A_ERRORS.AUTHORIZATION_FORBIDDEN }
  );
});
