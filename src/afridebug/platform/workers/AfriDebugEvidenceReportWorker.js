import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";

const AfriDebugEvidenceReportWorker = {

  execute(input = {}) {

    const intake = input.intake || {};
    const graph = input.graph || {};
    const runtime = input.runtime || {};
    const logs = input.logs || {};
    const knowledge = input.knowledge || {};

    const findings = [];

    if (intake.status === "INTAKE_COMPLETED") {
      findings.push({
        area: "repository",
        status: "CONFIRMED",
        detail: "Repository intake completed",
        repository: intake.repository || null
      });
    }

    if (graph.status === "GRAPH_COMPLETED") {
      findings.push({
        area: "dependency_graph",
        status: "CONFIRMED",
        detail: "Dependency graph completed",
        files: graph.files ?? 0,
        imports: graph.imports ?? 0,
        localImports: graph.localImports ?? 0,
        externalImports: graph.externalImports ?? 0,
        externalDependencies: graph.externalDependencies || []
      });
    }

    if (runtime.status) {
      findings.push({
        area: "runtime",
        status: runtime.status,
        runtime: runtime.runtime || null,
        checks: runtime.checks || []
      });
    }

    if (logs.status) {
      findings.push({
        area: "logs",
        status: logs.status,
        errors: logs.errors || [],
        warnings: logs.warnings || [],
        stack: logs.stack || null
      });
    }

    findings.push({
      area: "knowledge",
      status: knowledge.status || "SEARCH_COMPLETED",
      matches: knowledge.matches || [],
      confidence: knowledge.confidence || "NONE"
    });

    if (input.diagnosis) {
      findings.push({
        area: "diagnosis",
        status: input.diagnosis.status || "AVAILABLE",
        diagnosis: input.diagnosis.diagnosis || null,
        rootCause: input.diagnosis.rootCause || null,
        affectedComponents: input.diagnosis.affectedComponents || [],
        failurePath: input.diagnosis.failurePath || [],
        impact: input.diagnosis.impact || null,
        recommendedFix: input.diagnosis.recommendedFix || null,
        confidence: input.diagnosis.confidence || null,
        evidenceReferences: input.diagnosis.evidenceReferences || []
      });
    }

    if (input.patch) {
      findings.push({
        area: "patch",
        status: input.patch.status || "AVAILABLE",
        patch: input.patch
      });
    }

    if (input.verification) {
      findings.push({
        area: "verification",
        status: input.verification.status || "AVAILABLE",
        verification: input.verification
      });
    }

    const report = {
      id:`REPORT-${Date.now()}`,
      investigationId: input.investigationId || null,
      findings,
      evidence: {
        intake,
        graph,
        runtime,
        logs,
        knowledge,
        diagnosis: input.diagnosis || null,
        patch: input.patch || null,
        verification: input.verification || null
      },
      format:"AfriDebug Evidence Report",
      status:"EVIDENCE_REPORT_READY",
      generatedAt:Date.now()
    };

    ArtifactStorage.save(
      "reports",
      report.id,
      report
    );

    return report;
  }

};

export default AfriDebugEvidenceReportWorker;
