const stages = [
  "RepositoryIntake",
  "DependencyGraphBuilder",
  "RuntimeInspector",
  "LogAnalyzer",
  "KnowledgeMatcher",
  "PatchPlanner",
  "VerificationEngine",
  "EvidenceReportGenerator",
  "DeliveryPackager"
];

const AfriDebugInvestigationRegistry = {
  list() {
    return [...stages];
  },
  has(stage) {
    return stages.includes(stage);
  },
  count() {
    return stages.length;
  }
};

export default AfriDebugInvestigationRegistry;
