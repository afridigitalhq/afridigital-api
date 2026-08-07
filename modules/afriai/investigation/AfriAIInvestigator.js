import AfriAIDiagnosisContract from "../diagnosis/AfriAIDiagnosisContract.js";
import AfriAIEvidenceEnricher from "../evidence/enrichment/AfriAIEvidenceEnricher.js";
import AfriAIEvidenceGuard from "../guards/AfriAIEvidenceGuard.js";
import AfriAIProviderResilience from "../providers/resilience/AfriAIProviderResilience.js";
import AfriFixRemediationPlanner from "../remediation/AfriFixRemediationPlanner.js";
import askOllama from "../llm/OllamaClient.js";

const AfriAIInvestigator = {

  async investigate(evidence = {}) {

    const enrichedEvidence =
      AfriAIEvidenceEnricher.enrich(evidence);

    const prompt = `
You are AfriAI Investigation Engine.

Analyze ONLY the supplied evidence.

Do not invent:
- attacks
- malware
- attackers
- vulnerabilities
- compromises
- phishing
- security breaches
- root causes not supported by evidence

Clearly distinguish observed evidence from hypotheses.

Return:
1. Possible root cause
2. Risk level
3. Recommended next action

Evidence:
${JSON.stringify(enrichedEvidence, null, 2)}
`;

    const execution =
      await AfriAIProviderResilience.execute(
        enrichedEvidence,
        async () => await askOllama(prompt)
      );

    const analysis =
      execution.status === "PROVIDER_SUCCESS"
        ? execution.result
        : "AI provider unavailable. Evidence preserved for later analysis.";

    const diagnosis =
      AfriAIDiagnosisContract.create({
        rootCause: analysis,
        affectedComponent: "AfriAI Investigation Pipeline",
        severity:
          execution.status === "PROVIDER_SUCCESS"
            ? "LOW"
            : "HIGH",
        confidence:
          execution.status === "PROVIDER_SUCCESS"
            ? "MEDIUM"
            : "LOW",
        recommendedFix:
          execution.status === "PROVIDER_SUCCESS"
            ? "Continue validation"
            : "Restore AI provider connection"
      });

    const diagnosisValidation =
      AfriAIDiagnosisContract.validate(diagnosis);

    const evidenceGuard =
      AfriAIEvidenceGuard.evaluate(
        enrichedEvidence,
        diagnosis
      );

    const remediation =
      evidenceGuard.supported
        ? AfriFixRemediationPlanner.plan({
            rootCause: diagnosis.rootCause,
            severity: diagnosis.severity,
            confidence: diagnosis.confidence,
            recommendedFix: diagnosis.recommendedFix
          })
        : {
            diagnosis: {
              rootCause: diagnosis.rootCause,
              severity: diagnosis.severity,
              confidence: diagnosis.confidence,
              recommendedFix: diagnosis.recommendedFix
            },
            remediation: null,
            verification: [],
            status: "REMEDIATION_BLOCKED"
          };

    return {
      engine: "AfriAI Investigator",
      evidence: enrichedEvidence,
      provider: execution,
      analysis,
      diagnosis,
      diagnosisValidation,
      evidenceGuard,
      remediation,
      status:
        execution.status === "PROVIDER_SUCCESS"
          ? "ANALYZED"
          : "PENDING"
    };

  }

};

export default AfriAIInvestigator;
