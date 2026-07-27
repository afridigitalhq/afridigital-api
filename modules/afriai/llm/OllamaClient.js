import axios from "axios";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_URL?.replace("/api/generate","") || "";

const OLLAMA_GENERATE_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434/api/generate";

const REQUESTED_MODEL =
  process.env.OLLAMA_MODEL || "qwen2.5";

const OLLAMA_API_KEY =
  process.env.OLLAMA_API_KEY || "";


async function getAvailableModel(){

  try {

    const response = await axios.get(
      `${OLLAMA_BASE_URL}/api/tags`,
      {
        timeout:10000,
        headers:{
          Authorization:`Bearer ${OLLAMA_API_KEY}`
        }
      }
    );

    const models =
      response.data.models || [];

    const names =
      models.map(model=>model.name);

    console.log("🧠 AVAILABLE OLLAMA MODELS:", names);

    if(names.includes(REQUESTED_MODEL)){
      return REQUESTED_MODEL;
    }

    return names[0] || REQUESTED_MODEL;

  } catch(error){

    console.log(
      "⚠️ Ollama model discovery failed:",
      error.response?.data || error.message
    );

    return REQUESTED_MODEL;

  }

}


export async function askOllama(prompt){

  console.log("🧪 OLLAMA ENV CHECK:", {
    url:Boolean(process.env.OLLAMA_URL),
    model:REQUESTED_MODEL,
    key:Boolean(process.env.OLLAMA_API_KEY)
  });


  const model =
    await getAvailableModel();


  try {

    const response =
      await axios.post(
        OLLAMA_GENERATE_URL,
        {
          model,
          prompt,
          stream:false
        },
        {
          timeout:30000,
          headers:{
            Authorization:`Bearer ${OLLAMA_API_KEY}`,
            "Content-Type":"application/json"
          }
        }
      );


    console.log(
      "🧠 OLLAMA MODEL USED:",
      model
    );


    return response.data.response || "";


  } catch(error){

    console.log(
      "⚠️ Ollama unavailable:",
      error.response?.data || error.message
    );

    return "";

  }

}


export default askOllama;
