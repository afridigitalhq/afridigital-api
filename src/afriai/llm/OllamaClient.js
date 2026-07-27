import axios from "axios";

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434/api/generate";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5";

const OLLAMA_API_KEY =
  process.env.OLLAMA_API_KEY || "";

export async function askOllama(prompt){

  try {

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream:false
      },
      {
        timeout:10000,
        headers:{
          Authorization:`Bearer ${OLLAMA_API_KEY}`,
          "Content-Type":"application/json"
        }
      }
    );

    return response.data.response || "";

  } catch(error){

    console.log("⚠️ Ollama unavailable:", error.response?.data || error.message);

    return "";

  }

}

export default askOllama;
