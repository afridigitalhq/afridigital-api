const OpenAI = require("openai");

function client(){
  if(!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function fallback(text){
  const t = text.toLowerCase();

  let category = "general";
  let actions = [];

  if(t.includes("error") || t.includes("fix") || t.includes("crash")){
    category = "support";
    actions.push({ type: "suggest_debug" });
  }

  if(t.includes("pay") || t.includes("buy")){
    category = "commerce";
    actions.push({ type: "init_payment_flow" });
  }

  if(t.includes("server") || t.includes("deploy")){
    category = "devops";
    actions.push({ type: "check_logs" });
  }

  return {
    category,
    response: "Fallback reasoning active (no LLM).",
    confidence: 0.4,
    actions
  };
}

module.exports = {
  async think(event){

    const text = (event.text || "").toString();
    const ai = client();

    // ⚡ fallback brain (always safe)
    if(!ai){
      return fallback(text);
    }

    try {
      const res = await ai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are AfriCore Brain.

Return STRICT JSON only:
{
  "category": "support|commerce|devops|general",
  "response": "short answer",
  "confidence": 0-1,
  "actions": []
}
`
          },
          { role: "user", content: text }
        ],
        temperature: 0.3
      });

      const raw = res.choices[0].message.content;

      try {
        return JSON.parse(raw);
      } catch {
        return fallback(text);
      }

    } catch (e){
      return fallback(text);
    }
  }
};
