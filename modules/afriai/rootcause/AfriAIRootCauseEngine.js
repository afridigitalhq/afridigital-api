import askOllama from "../llm/OllamaClient.js";

const AfriAIRootCauseEngine = {
  async analyze(evidence){

    const prompt = `
You are AfriAI Root Cause Engine.

Analyze this engineering evidence:

${JSON.stringify(evidence,null,2)}

Return JSON:
{
 "rootCause":"",
 "confidence":"",
 "riskLevel":"",
 "recommendedAction":""
}
`;

    let result = await askOllama(prompt);

    const cleaned = result
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    try {
      result = JSON.parse(cleaned);
    } catch {
      result = {
        rootCause:"Unable to parse structured diagnosis",
        confidence:"LOW",
        riskLevel:"UNKNOWN",
        recommendedAction:"Review evidence manually"
      };
    }

    return {
      engine:"AfriAI Root Cause Engine",
      evidence,
      analysis:result,
      status:"ROOT_CAUSE_ANALYZED"
    };
  }
};

export default AfriAIRootCauseEngine;
