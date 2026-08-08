import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_URL || "";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2:0.5b";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "";
const AFRIAI_PROVIDER_TIMEOUT_MS = Number(process.env.AFRIAI_PROVIDER_TIMEOUT_MS || 60000);

function endpoint(){
  return OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
}

export function ollamaConfig(){
  return {
    url:endpoint(),
    model:OLLAMA_MODEL,
    configured:Boolean(OLLAMA_URL),
    mode:OLLAMA_URL ? "REMOTE" : "LOCAL"
  };
}

export async function askOllama(prompt){
  const config=ollamaConfig();

  try{
    const response=await axios.post(
      config.url,
      {
        model:config.model,
        prompt,
        stream:false
      },
      {
        timeout:AFRIAI_PROVIDER_TIMEOUT_MS,
        headers:{
          Authorization:`Bearer ${OLLAMA_API_KEY}`,
          "Content-Type":"application/json"
        }
      }
    );

    return response.data.response || "";

  }catch(error){
    console.log("⚠️ Ollama unavailable:",error.message);
    return "";
  }
}

export default askOllama;
