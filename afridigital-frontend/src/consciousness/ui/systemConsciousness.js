export function buildSystemConsciousness({
  narrative,
  soc,
  radar,
  multiverse,
  recommendations
}) {
  return {
    identity: "SYSTEM_CONSCIOUSNESS_CORE",

    perception: {
      narrative: narrative?.narrative,
      status: soc?.systemStatus || "UNKNOWN"
    },

    awareness: {
      threatLevel: radar?.globalThreatLevel,
      recommendationCount: recommendations?.length || 0
    },

    cognition: {
      activeUniverses: multiverse?.multiverse?.length || 0,
      dominantReality:
        multiverse?.multiverse?.find(m => m.summary.riskLevel === "LOW")
          ? "STABLE_BRANCH_AVAILABLE"
          : "RISK_DOMINANT_BRANCHES"
    },

    mode: "UNIFIED_OPS_BRAIN_VIEW"
  };
}
