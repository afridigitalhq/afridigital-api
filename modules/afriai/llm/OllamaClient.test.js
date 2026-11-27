import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

test("Ollama generation and health checks forward optional Bearer authentication",async()=>{
  const originalPost=axios.post;
  const originalGet=axios.get;
  const envKeys=["OLLAMA_URL","OLLAMA_MODEL","OLLAMA_API_KEY"];
  const previous=Object.fromEntries(envKeys.map(key=>[key,process.env[key]]));
  const testKey="test-only-ollama-key";
  let request;
  let healthRequest;

  try{
    process.env.OLLAMA_URL="https://ollama.example/api/generate";
    process.env.OLLAMA_MODEL="test-model";
    process.env.OLLAMA_API_KEY=testKey;

    axios.post=async(url,body,config)=>{
      request={url,body,config};
      return {data:{response:'{"ok":true}'}};
    };
    axios.get=async(url,config)=>{
      healthRequest={url,config};
      return {data:{models:[]}};
    };

    const {askOllama}=await import("./OllamaClient.js?request-test");
    const healthModule=await import("../providers/health/AfriAIProviderHealth.js?request-test");

    const output=await askOllama("Generate JSON",{
      model:"coding-model",
      maxOutputTokens:8192,
      timeoutMs:180000,
      temperature:0.1,
      responseFormat:"json"
    });

    assert.equal(output,'{"ok":true}');
    assert.equal(request.url,"https://ollama.example/api/generate");
    assert.equal(request.body.model,"coding-model");
    assert.equal(request.body.options.num_predict,8192);
    assert.equal(request.body.format,"json");
    assert.equal(request.config.timeout,180000);
    assert.equal(request.config.headers.Authorization,`Bearer ${testKey}`);

    assert.equal(await healthModule.default.check({name:"ollama"}),true);
    assert.equal(healthRequest.url,"https://ollama.example/api/tags");
    assert.equal(healthRequest.config.timeout,2000);
    assert.equal(healthRequest.config.headers.Authorization,`Bearer ${testKey}`);
  }finally{
    axios.post=originalPost;
    axios.get=originalGet;
    for(const key of envKeys){
      if(previous[key]===undefined) delete process.env[key];
      else process.env[key]=previous[key];
    }
  }
});

test("Ollama errors log sanitized HTTP status without exposing secrets or response bodies",async()=>{
  const originalPost=axios.post;
  const originalLog=console.log;
  const envKeys=["OLLAMA_URL","OLLAMA_MODEL","OLLAMA_API_KEY"];
  const previous=Object.fromEntries(envKeys.map(key=>[key,process.env[key]]));
  const testKey="private-test-api-key";
  const testUrl="https://ollama.example/api/generate";
  const logs=[];
  try{
    process.env.OLLAMA_URL=testUrl;
    process.env.OLLAMA_MODEL="test-model";
    process.env.OLLAMA_API_KEY=testKey;
    axios.post=async()=>{
      const error=new Error("private upstream response body");
      error.code="ERR_BAD_REQUEST";
      error.response={status:410,data:{message:"private upstream response"}};
      throw error;
    };
    console.log=(...args)=>logs.push(args.join(" "));
    const {askOllama}=await import("./OllamaClient.js?sanitized-error-test");
    assert.equal(await askOllama("test"),"");
    const output=logs.join(" ");
    assert.match(output,/HTTP_410/);
    assert.match(output,/CODE_ERR_BAD_REQUEST/);
    assert.equal(output.includes(testKey),false);
    assert.equal(output.includes(testUrl),false);
    assert.equal(output.includes("private upstream"),false);
    assert.equal(output.includes("private-test-api-key"),false);
  }finally{
    axios.post=originalPost;
    console.log=originalLog;
    for(const key of envKeys){
      if(previous[key]===undefined) delete process.env[key];
      else process.env[key]=previous[key];
    }
  }
});
