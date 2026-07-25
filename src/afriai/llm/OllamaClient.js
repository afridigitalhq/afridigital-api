import axios from "axios";

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434/api/generate";

export async function askOllama(prompt){

  try {

    const response = await axios.post(
      OLLAMA_URL,
      {
        model:"qwen2:0.5b",
        prompt,
        stream:false
      },
      {
        timeout:5000
      }
    );

    return response.data.response || "";

  } catch(error){

    console.log("⚠️ Ollama unavailable, using fallback runtime");

    return "";

  }

}

export default askOllama;
