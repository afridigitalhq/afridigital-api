import axios from "axios";

const OLLAMA_URL=process.env.OLLAMA_URL||"";
const OLLAMA_MODEL=process.env.OLLAMA_MODEL||"qwen2:0.5b";
const OLLAMA_API_KEY=process.env.OLLAMA_API_KEY||"";
const DEFAULT_TIMEOUT_MS=Number(process.env.AFRIAI_PROVIDER_TIMEOUT_MS||60000);
const DEFAULT_NUM_PREDICT=Number(process.env.AFRIAI_OLLAMA_NUM_PREDICT||48);
const DEFAULT_TEMPERATURE=Number(process.env.AFRIAI_OLLAMA_TEMPERATURE||0.1);

function bounded(value,fallback,min,max){
  const number=Number(value);
  return Number.isFinite(number)?Math.min(max,Math.max(min,Math.floor(number))):fallback;
}

function endpoint(){
  return OLLAMA_URL||"http://127.0.0.1:11434/api/generate";
}

export function ollamaConfig(){
  return {
    url:endpoint(),
    model:OLLAMA_MODEL,
    configured:Boolean(OLLAMA_URL),
    mode:OLLAMA_URL?"REMOTE":"LOCAL"
  };
}

export async function askOllama(prompt,options={}){
  if(typeof prompt!=="string"||!prompt.trim()) return "";

  const config=ollamaConfig();
  const model=typeof options.model==="string"&&options.model.trim()?options.model.trim():config.model;
  const numPredict=bounded(options.maxOutputTokens??options.numPredict,DEFAULT_NUM_PREDICT,1,16384);
  const timeout=bounded(options.timeoutMs,DEFAULT_TIMEOUT_MS,1000,300000);
  const temperature=Number.isFinite(Number(options.temperature))
    ?Math.min(2,Math.max(0,Number(options.temperature)))
    :DEFAULT_TEMPERATURE;

  try{
    const response=await axios.post(
      config.url,
      {
        model,
        prompt,
        stream:false,
        options:{num_predict:numPredict,temperature},
        ...(options.responseFormat==="json"?{format:"json"}:{})
      },
      {
        timeout,
        headers:{
          ...(OLLAMA_API_KEY?{Authorization:`Bearer ${OLLAMA_API_KEY}`}:{ }),
          "Content-Type":"application/json"
        }
      }
    );
    return response.data?.response||"";
  }catch(error){
    console.log("⚠️ Ollama unavailable:",error.message);
    return "";
  }
}

export default askOllama;
