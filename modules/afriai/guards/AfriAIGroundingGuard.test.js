import test from "node:test";
import assert from "node:assert/strict";
import Guard from "./AfriAIGroundingGuard.js";

test("rejects a response when the supplied knowledge is ungrounded", () => {
  const result = Guard.evaluate("AfriDigital knowledge response ready.", {
    grounded: false,
    type: "KNOWLEDGE_NOT_FOUND"
  });
  assert.equal(result.supported, false);
  assert.ok(result.unsupportedClaims.includes("KNOWLEDGE_NOT_FOUND"));
});

test("accepts a response supported by canonical platform knowledge", () => {
  const knowledge = {
    grounded: true,
    platform: {
      platform: {
        description: "Africa's digital ecosystem connecting people, businesses and services through one intelligent platform."
      }
    }
  };
  const result = Guard.evaluate(knowledge.platform.platform.description, knowledge);
  assert.equal(result.supported, true);
});
