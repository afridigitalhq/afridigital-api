const AfriAIEvidenceGuard = {

  evaluate(evidence = {}, diagnosis = {}) {

    const observations = [];
    const claims = [];

    if (evidence.security?.status === "CONNECTED") {
      observations.push("Security connection confirmed");
    }

    if (evidence.security?.gateway) {
      observations.push(`Security gateway: ${evidence.security.gateway}`);
    }

    if (evidence.scan?.status === "READY") {
      observations.push("Scan readiness confirmed");
    }

    if (evidence.scan?.evidence === "COLLECTED") {
      observations.push("Scan evidence collected");
    }

    if (evidence.scan?.duplicates !== undefined) {
      observations.push(`Scan duplicates: ${evidence.scan.duplicates}`);
    }

    if (evidence.debug?.status === "READY") {
      observations.push("Debug runtime ready");
    }

    if (evidence.debug?.runtime === "LOADED") {
      observations.push("Debug runtime loaded");
    }

    if (Array.isArray(evidence.debug?.logs)) {
      observations.push(...evidence.debug.logs);
    }

    const rootCause =
      typeof diagnosis.rootCause === "string"
        ? diagnosis.rootCause.trim()
        : "";

    const recommendedFix =
      typeof diagnosis.recommendedFix === "string"
        ? diagnosis.recommendedFix.trim()
        : "";

    const lower = rootCause.toLowerCase();

    const unsupportedPatterns = [
      "internet",
      "phishing",
      "intruder",
      "attacker",
      "malware",
      "infected",
      "compromised",
      "security breach",
      "data breach",
      "hack",
      "hacked",
      "unauthorized access",
      "exploit",
      "vulnerability",
      "firewall",
      "intrusion detection",
      "ids",
      "penetration testing"
    ];

    for (const pattern of unsupportedPatterns) {
      if (lower.includes(pattern)) {
        claims.push({
          claim: pattern,
          classification: "UNSUPPORTED",
          reason: "Claim is not directly established by supplied evidence"
        });
      }
    }

    if (lower.includes("timeout") &&
        !observations.some(x => x.toLowerCase().includes("timeout"))) {
      claims.push({
        claim: "timeout",
        classification: "UNSUPPORTED",
        reason: "No timeout evidence was supplied"
      });
    }

    if (lower.includes("connected") &&
        evidence.security?.status !== "CONNECTED") {
      claims.push({
        claim: "connected",
        classification: "UNSUPPORTED",
        reason: "Connection status is not confirmed by evidence"
      });
    }

    if (claims.length === 0 && rootCause) {
      claims.push({
        claim: rootCause,
        classification: "INFERRED",
        reason: "No direct contradiction or unsupported security claim detected"
      });
    }

    const unsupportedClaims =
      claims.filter(c => c.classification === "UNSUPPORTED");

    const evidencePresent = observations.length > 0;

    const supported =
      evidencePresent &&
      rootCause.length > 0 &&
      recommendedFix.length > 0 &&
      unsupportedClaims.length === 0;

    return {
      observations,
      claims,
      evidencePresent,
      unsupportedClaim: unsupportedClaims.length > 0,
      unsupportedClaims,
      supported,
      status: supported
        ? "EVIDENCE_SUPPORTED"
        : "EVIDENCE_INSUFFICIENT",
      recommendation: supported
        ? "Diagnosis may proceed to remediation planning"
        : "Block remediation and require additional evidence or human investigation"
    };
  }

};

export default AfriAIEvidenceGuard;
