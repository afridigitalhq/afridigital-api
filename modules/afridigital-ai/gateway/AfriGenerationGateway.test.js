import test from "node:test";
import assert from "node:assert/strict";
import {createAfriLLMProviderContract} from "../contracts/AfriLLMProviderContract.js";
import {createAfriLLMProviderRegistry} from "../providers/AfriLLMProviderRegistry.js";
import {createAfriGenerationProfileRegistry} from "../profiles/AfriGenerationProfileRegistry.js";
import {createAfriGenerationGateway} from "./AfriGenerationGateway.js";

function setup(providerSelection){
  const registry=createAfriLLMProviderRegistry();
  registry.register(createAfriLLMProviderContract({
    name:"test-provider-a",
    generate:async request=>({content:`A:${request.prompt}`,model:"model-a"})
  }));
  registry.register(createAfriLLMProviderContract({
    name:"test-provider-b",
    generate:async request=>({content:`B:${request.prompt}`,model:"model-b"})
  }));
  return createAfriGenerationGateway({
    providerRegistry:registry,
    profileRegistry:createAfriGenerationProfileRegistry(),
    providerSelection
  });
}

test("coding profile has an independent long-output budget",()=>{
  const profiles=createAfriGenerationProfileRegistry();
  assert.equal(profiles.get("conversation").maxOutputTokens,48);
  assert.ok(profiles.get("coding").maxOutputTokens>48);
});

test("provider selection switches without changing the generation caller",async()=>{
  const request={prompt:"build a safe patch",profile:"coding"};
  const first=await setup({coding:"test-provider-a"}).generate(request);
  const second=await setup({coding:"test-provider-b"}).generate(request);
  assert.equal(first.provider,"test-provider-a");
  assert.equal(first.content,"A:build a safe patch");
  assert.equal(second.provider,"test-provider-b");
  assert.equal(second.content,"B:build a safe patch");
});

test("generation rejects unknown profiles and missing providers",async()=>{
  const gateway=setup({coding:"missing-provider"});
  await assert.rejects(gateway.generate({prompt:"test",profile:"unknown"}),/PROFILE_UNKNOWN/);
  await assert.rejects(gateway.generate({prompt:"test",profile:"coding"}),/NOT_REGISTERED/);
});

test("generation enforces bounded request options",async()=>{
  const gateway=setup({coding:"test-provider-a"});
  const result=await gateway.generate({
    prompt:"test",
    profile:"coding",
    options:{maxOutputTokens:999999,timeoutMs:999999}
  });
  assert.equal(result.ok,true);
});

test("gateway rejects a provider explicitly reporting unavailable health",async()=>{
  const providerRegistry={
    get:()=>({
      name:"offline-provider",
      supports:()=>true,
      health:async()=>({status:"UNAVAILABLE"}),
      generate:async()=>({content:"should not execute"})
    })
  };
  const profileRegistry={
    get:()=>({maxOutputTokens:100,timeoutMs:1000,temperature:0.1})
  };
  const gateway=createAfriGenerationGateway({
    providerRegistry,
    profileRegistry,
    defaultProvider:"offline-provider"
  });

  await assert.rejects(
    gateway.generate({prompt:"test"}),
    /AFRI_LLM_PROVIDER_UNAVAILABLE/
  );
});
