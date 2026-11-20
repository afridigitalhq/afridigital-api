import test from "node:test";
import assert from "node:assert/strict";
import Retriever from "./AfriAIKnowledgeRetriever.js";

test("retrieves platform and product knowledge from natural platform questions", () => {
  const result = Retriever.retrieve("Using AfriDigital knowledge, identify the platform and name one product.");
  assert.equal(result.grounded, true);
  assert.ok(result.platform?.platform?.description);
  assert.ok(result.products?.AfriCommerce?.description);
});

test("retrieves the requested product from a product-specific question", () => {
  const result = Retriever.retrieve("Describe AfriCommerce and its current development status.");
  assert.equal(result.grounded, true);
  assert.ok(result.products?.AfriCommerce?.description);
  assert.equal(result.products.AfriCommerce.status, "Beta");
});

test("returns an explicitly ungrounded result for unrelated questions", () => {
  const result = Retriever.retrieve("What is the weather on Mars?");
  assert.equal(result.grounded, false);
  assert.equal(result.type, "KNOWLEDGE_NOT_FOUND");
});
