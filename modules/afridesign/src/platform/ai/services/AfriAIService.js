const AFRIAI_API =
  "https://afridigital-api.onrender.com/api/afriai/ask";

const AfriAIService = {

  async ask(message, context = {}){

    const response = await fetch(AFRIAI_API, {
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        sessionId:"afridesign-studio",
        message,
        context
      })
    });

    if(!response.ok){
      throw new Error("AfriAI request failed");
    }

    return await response.json();

  }

};

export default AfriAIService;
