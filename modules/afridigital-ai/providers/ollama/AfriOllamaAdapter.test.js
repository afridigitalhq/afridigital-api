import test from "node:test";
import assert from "node:assert/strict";
import {createAfriOllamaAdapter} from "./AfriOllamaAdapter.js";

test("Ollama adapter maps gateway generation settings to the legacy provider",async()=>{
  let received;
  const adapter=createAfriOllamaAdapter({
    provider:{
      generate:async(prompt,options)=>{
        received={prompt,options};
        return "generated output";
      }
    }
  });

  const result=await adapter.generate({
    prompt:"Create a safe patch",
    model:"coding-model",
    maxOutputTokens:8192,
    timeoutMs:180000,
    temperature:0.1,
      responseFormat:"json"
  });

  assert.equal(received.prompt,"Create a safe patch");
  assert.deepEqual(received.options,{
    model:"coding-model",
    maxOutputTokens:8192,
    timeoutMs:180000,
    temperature:0.1,
      responseFormat:"json"
  });
  assert.equal(result.provider,"ollama");
  assert.equal(result.content,"generated output");
});

test("Ollama adapter rejects empty model responses",async()=>{
  const adapter=createAfriOllamaAdapter({
    provider:{generate:async()=>" "}
  });
  await assert.rejects(
    adapter.generate({prompt:"test"}),
    /AFRI_OLLAMA_EMPTY_RESPONSE/
  );
});

test("Ollama adapter rejects invalid providers",()=>{
  assert.throws(
    ()=>createAfriOllamaAdapter({provider:{}}),
    /AFRI_OLLAMA_ADAPTER_PROVIDER_INVALID/
  );
});

test("Ollama adapter reports available health using its injected check",async()=>{
  const adapter=createAfriOllamaAdapter({
    provider:{generate:async()=>"ok"},
    healthCheck:async()=>true
  });
  assert.deepEqual(await adapter.health(),{
    status:"AVAILABLE",
    provider:"ollama"
  });
});

test("Ollama adapter reports unavailable health without throwing",async()=>{
  const adapter=createAfriOllamaAdapter({
    provider:{generate:async()=>"ok"},
    healthCheck:async()=>false
  });
  assert.deepEqual(await adapter.health(),{
    status:"UNAVAILABLE",
    provider:"ollama"
  });
});
