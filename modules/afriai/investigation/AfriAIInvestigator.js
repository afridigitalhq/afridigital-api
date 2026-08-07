import AfriInvestigationEvidence from "../evidence/AfriInvestigationEvidence.js";

import askOllama from "../llm/OllamaClient.js";

const AfriAIInvestigator = {
  async investigate(evidence) {

    const prompt = `
You are AfriAI Investigation Engine.

Analyze this evidence:

${JSON.stringify(evidence,null,2)}

Return:
1. Possible root cause
2. Risk level
3. Recommended next action
`;

    const response = await askOllama(prompt);

    return {
      engine:"AfriAI Investigator",
      evidence,
      analysis:response || "No AI response available",
      status: response ? "ANALYZED" : "PENDING"
    };
  }
};

export default AfriAIInvestigator;
