import afriAIRuntime from "../runtime/AfriAIRuntime.js";

const AfriAIDebugExplainer = {
  async explain(diagnostic = {}) {
    const evidence = {
      status: diagnostic.status,
      rootCause: diagnostic.rootCause,
      analysis: diagnostic.analysis,
      plan: diagnostic.plan,
      validation: diagnostic.validation,
      tests: diagnostic.tests,
      approval: diagnostic.approval,
      report: diagnostic.report
    };

    const prompt = `Explain this AfriDebug diagnostic to a client in clear human language.

Rules:
- Treat the diagnostic evidence as authoritative.
- Do not invent causes, fixes, test results, or system capabilities.
- Clearly distinguish detected facts from recommendations.
- If status is AWAITING_HUMAN_APPROVAL, explain that no patch has been applied.
- Be concise and professional.
- Explain: what happened, impact, evidence, current status, and next action.

AFRIDEBUG EVIDENCE:
${JSON.stringify(evidence, null, 2)}`;

    return afriAIRuntime.ask(prompt);
  }
};

export default AfriAIDebugExplainer;
