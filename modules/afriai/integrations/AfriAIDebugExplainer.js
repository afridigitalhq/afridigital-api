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
- If confidence is low or there are zero logs/findings, state that the evidence is insufficient to confirm a defect.
- Do not imply that a proposed patch is justified when no defect has been confirmed.
- When additional evidence is recommended, make collecting that evidence the primary next action before any patch approval decision.
- When zero findings are present, explain that human approval should not be treated as confirmation that a defect exists.
- Do not describe approval as the next required action when the evidence is insufficient; recommend evidence collection and human review first.
- Be concise and professional.
- Explain: what happened, impact, evidence, current status, and next action.

AFRIDEBUG EVIDENCE:
${JSON.stringify(evidence, null, 2)}`;

    return afriAIRuntime.ask(prompt);
  }
};

export default AfriAIDebugExplainer;
