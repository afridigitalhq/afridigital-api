import test from "node:test";
import assert from "node:assert/strict";
import KnowledgeProvider from "./KnowledgeProvider.js";

test("answers platform questions with canonical platform and product knowledge", async () => {
  const prompt = "You are AfriAI.\nUser: Using AfriDigital knowledge, identify the platform and name one product.\nAfriAI:";
  const result = JSON.parse(await KnowledgeProvider.generate(prompt));
  assert.equal(result.provider, "knowledge");
  assert.equal(result.status, "READY");
  assert.match(result.answer || "", /Africa's digital ecosystem/i);
  assert.match(result.answer || "", /AfriCommerce/);
  assert.ok(result.sources.length > 0);
});

test("does not claim successful knowledge execution when retrieval is ungrounded", async () => {
  const prompt = "You are AfriAI.\nUser: What is the weather on Mars?\nAfriAI:";
  const result = JSON.parse(await KnowledgeProvider.generate(prompt));
  assert.notEqual(result.status, "READY");
  assert.equal(result.grounded, false);
});
