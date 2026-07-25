import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

export async function askOllama(prompt){

  const response = await axios.post(
    OLLAMA_URL,
    {
      model:"qwen2:0.5b",
      prompt,
      stream:false
    }
  );

  return response.data.response || "";

}

export default askOllama;
