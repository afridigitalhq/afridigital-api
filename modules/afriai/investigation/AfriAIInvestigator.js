import AfriAIProviderResilience from "../providers/resilience/AfriAIProviderResilience.js";
import askOllama from "../llm/OllamaClient.js";

const AfriAIInvestigator = {

  async investigate(evidence){

    const prompt = `
You are AfriAI Investigation Engine.

Analyze this evidence:

${JSON.stringify(evidence,null,2)}

Return:
1. Possible root cause
2. Risk level
3. Recommended next action
`;

    const execution = await AfriAIProviderResilience.execute(
      evidence,
      async()=>{
        return await askOllama(prompt);
      }
    );

    const analysis =
      execution.status === "PROVIDER_SUCCESS"
      ? execution.result
      : "AI provider unavailable. Evidence preserved for later analysis.";

    return {
      engine:"AfriAI Investigator",
      evidence,
      provider:execution,
      analysis,
      status:
        execution.status === "PROVIDER_SUCCESS"
        ? "ANALYZED"
        : "PENDING"
    };

  }

};

export default AfriAIInvestigator;
