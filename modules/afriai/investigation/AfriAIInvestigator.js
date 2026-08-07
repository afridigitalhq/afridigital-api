import AfriAIDiagnosisContract from "../diagnosis/AfriAIDiagnosisContract.js";
import AfriAIEvidenceEnricher from "../evidence/enrichment/AfriAIEvidenceEnricher.js";
import AfriAIProviderResilience from "../providers/resilience/AfriAIProviderResilience.js";
import AfriFixRemediationPlanner from "../remediation/AfriFixRemediationPlanner.js";
import askOllama from "../llm/OllamaClient.js";

const AfriAIInvestigator = {
  async investigate(evidence = {}) {

    const enrichedEvidence =
      AfriAIEvidenceEnricher.enrich(evidence);

    const prompt = `
You are AfriAI Investigation Engine.

Analyze the enriched system evidence below.

${JSON.stringify(enrichedEvidence, null, 2)}

Return a concise technical investigation containing:
1. Possible root cause
2. Risk level
3. Recommended next action

Do not invent evidence.
If evidence is insufficient, explicitly say so.
`;

    const execution =
      await AfriAIProviderResilience.execute(
        enrichedEvidence,
        async () => await askOllama(prompt)
      );

    const providerAvailable =
      execution?.status === "PROVIDER_SUCCESS";

    const analysis =
      providerAvailable
        ? execution.result
        : "AI provider unavailable. Evidence preserved for later analysis.";

    const diagnosis =
      AfriAIDiagnosisContract.create({
        rootCause: analysis,
        affectedComponent:
          "AfriAI Investigation Pipeline",
        severity:
          providerAvailable ? "LOW" : "HIGH",
        confidence:
          providerAvailable ? "MEDIUM" : "LOW",
        recommendedFix:
          providerAvailable
            ? "Continue validation"
            : "Restore AI provider connection"
      });

    const diagnosisValidation =
      AfriAIDiagnosisContract.validate(diagnosis);

    const remediation =
      AfriFixRemediationPlanner.plan({
        rootCause: diagnosis.rootCause,
        severity: diagnosis.severity,
        confidence: diagnosis.confidence,
        recommendedFix: diagnosis.recommendedFix
      });

    return {
      engine: "AfriAI Investigator",
      evidence: enrichedEvidence,
      provider: execution,
      analysis,
      diagnosis,
      diagnosisValidation,
      remediation,
      status:
        providerAvailable
          ? "ANALYZED"
          : "PENDING"
    };
  }
};

export default AfriAIInvestigator;
