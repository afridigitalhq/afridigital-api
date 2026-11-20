import test from "node:test";
import assert from "node:assert/strict";
import {
  AfriDigitalAIGateway,
  AfriDigitalAIProviders,
  AfriDigitalAIProfiles,
  getAfriDigitalAIStatus
} from "./AfriDigitalAI.js";

test("shared AI runtime registers Ollama and exposes generation profiles",()=>{
  assert.equal(AfriDigitalAIProviders.has("ollama"),true);
  assert.equal(AfriDigitalAIProfiles.get("coding").maxOutputTokens,8192);
  assert.equal(AfriDigitalAIProfiles.get("conversation").maxOutputTokens,48);
  assert.ok(AfriDigitalAIProfiles.get("debugging"));
  assert.equal(typeof AfriDigitalAIGateway.generate,"function");
});

test("shared AI runtime exposes provider and profile status without secrets",()=>{
  const status=getAfriDigitalAIStatus();
  assert.deepEqual(status.providers,["ollama"]);
  assert.ok(status.profiles.includes("coding"));
  assert.equal("apiKey" in status,false);
  assert.equal("credentials" in status,false);
});
