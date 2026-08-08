import fs from "fs";
import path from "path";

export class AfriFixConsolidationPlanner {
  constructor(root = process.cwd()) {
    this.root = root;
    this.mappingPath = path.join(
      root,
      "modules/afrifix/evidence/consolidation/mapping.json"
    );
    this.outputPath = path.join(
      root,
      "modules/afrifix/evidence/consolidation/plan.json"
    );
  }

  plan() {
    if (!fs.existsSync(this.mappingPath)) {
      return {
        component: "AfriFix Consolidation Planner",
        status: "REJECTED",
        reason: "Mapping evidence not found",
        mappingPath: this.mappingPath,
        timestamp: new Date().toISOString()
      };
    }

    const mapping = JSON.parse(
      fs.readFileSync(this.mappingPath, "utf8")
    );

    const groups = (mapping.candidates || []).map((candidate) => ({
      coreKey: candidate.coreKey,
      proposedCoreService: candidate.proposedCoreService,
      candidateCount: candidate.candidateCount,
      classification: candidate.classification,
      disposition: "PENDING_REVIEW",
      migrationPolicy: "REVIEW_BEFORE_MIGRATION",
      productLogicPolicy: "RETAIN_PRODUCT_SPECIFIC_LOGIC",
      adapterPolicy: "PREFER_ADAPTERS_OVER_CROSS_PRODUCT_IMPORTS",
      candidates: candidate.productCandidates || []
    }));

    const totalCandidates = groups.reduce(
      (sum, group) => sum + group.candidateCount,
      0
    );

    const plan = {
      component: "AfriFix Consolidation Planner",
      status: "PLAN_GENERATED",
      phase: "DISCOVER -> MAP -> PLAN",
      source: mapping.source,
      generatedAt: new Date().toISOString(),
      rules: {
        candidateMeansPotentialDuplication: true,
        productSpecificLogicMustRemainInProduct: true,
        sharedCapabilitiesShouldMoveToCore: true,
        adaptersPreferredOverCrossProductImports: true,
        noAutomaticMigration: true,
        humanReviewRequired: true
      },
      summary: {
        coreKeys: mapping.coreKeys?.length || 0,
        groups: groups.length,
        totalCandidates,
        pendingReview: groups.length
      },
      executionOrder: [
        "REVIEW",
        "APPROVE",
        "MIGRATE",
        "VERIFY",
        "CERTIFY"
      ],
      groups
    };

    fs.writeFileSync(
      this.outputPath,
      JSON.stringify(plan, null, 2) + "\n"
    );

    return plan;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.url.replace("file://", ""))) {
  const planner = new AfriFixConsolidationPlanner();
  const result = planner.plan();
  console.log(JSON.stringify(result, null, 2));
}
