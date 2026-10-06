import State from "../state/AfriDebugInvestigationStateManager.js";
import Events from "../events/AfriDebugEventStream.js";

import Intake from "../workers/AfriDebugRepositoryIntakeWorker.js";
import Acquisition from "../workers/AfriDebugRepositoryAcquisitionWorker.js";
import Graph from "../workers/AfriDebugDependencyGraphWorker.js";
import Runtime from "../workers/AfriDebugRuntimeInspectorWorker.js";
import LogAnalyzer from "../workers/AfriDebugLogAnalyzerWorker.js";
import Knowledge from "../knowledge/AfriDebugKnowledgeAdapter.js";
import Patch from "../workers/AfriDebugPatchPlanningWorker.js";
import Verify from "../workers/AfriDebugVerificationWorker.js";
import Report from "../workers/AfriDebugEvidenceReportWorker.js";
import AfriSemanticRootCauseInterpreter from "../../../platform/analysis/AfriSemanticRootCauseInterpreter.js";
import ApprovalQueue from "../approval/AfriDebugRepairApprovalQueue.js";


const AfriDebugOrchestrator = {

  run(input = {}) {

    const investigationId =
      `INV-${Date.now()}`;


    const context = {
      objective: input.objective || null,
      category: input.category || null,
      constraints: input.constraints || [],
      repository: input.repository || null,
      handoffId: input.handoffId || null,
      mode: input.mode || input.objectiveType || input.category || "ROOT_CAUSE_ANALYSIS"
    };

    State.create({
      investigationId,
      ...context
    });


    Events.emit({
      investigationId,
      type:"INVESTIGATION_CREATED",
      actor:"AfriDebugOrchestrator",
      details:"Investigation initialized"
    });


      let acquisition = null;
    try {
    State.update(
      investigationId,
      "INTAKE_RUNNING"
    );


    let intake;

    acquisition = Acquisition.execute({
      repository: input.repository || null
    });

    if (acquisition.status === "ACQUISITION_FAILED") {
      State.update(
        investigationId,
        "INTAKE_FAILED"
      );

      Events.emit({
        investigationId,
        type:"REPOSITORY_ACQUISITION_FAILED",
        actor:"RepositoryAcquisitionWorker",
        details:acquisition.error || "Repository acquisition failed"
      });

      return {
        investigationId,
        mode:context.mode,
        status:"INTAKE_FAILED",
        error:acquisition.error || "REPOSITORY_ACQUISITION_FAILED",
        state:State.get(investigationId),
        events:Events.list(investigationId),
        artifacts:{
          acquisition
        }
      };
    }

    const repositoryInput =
      acquisition.acquired
        ? acquisition.repository
        : (input.repository || {});

    intake = Intake.execute({
      investigationId,
      ...repositoryInput,
      trustedExecution: true,
      context
    });

    if (intake.status !== "INTAKE_COMPLETED" || intake.repository?.connected !== true) {
      State.update(
        investigationId,
        "INTAKE_FAILED"
      );

      Events.emit({
        investigationId,
        type:"REPOSITORY_INTAKE_FAILED",
        actor:"RepositoryIntakeWorker",
        details:intake.error || "Repository intake failed"
      });

      return {
        investigationId,
        mode:context.mode,
        status:"INTAKE_FAILED",
        error:intake.error || "REPOSITORY_INTAKE_FAILED",
        state:State.get(investigationId),
        events:Events.list(investigationId),
        artifacts:{
          intake
        }
      };
    }

    Events.emit({
      investigationId,
      type:"REPOSITORY_INTAKE_COMPLETED",
      actor:"RepositoryIntakeWorker",
      details:"Repository connected and validated"
    });

    State.update(
      investigationId,
      "ANALYZING"
    );


    const graph = Graph.execute({
      investigationId,
      repository:intake.repository,
      context
    });


    const runtime = Runtime.execute({
      investigationId,
      context
    });


    const logs = LogAnalyzer.execute({
      investigationId,
      source:"runtime",
      context
    });


    const knowledge = Knowledge.search(
      logs.errors?.[0]?.message || "No runtime error detected"
    );



      const diagnosis = AfriSemanticRootCauseInterpreter.analyze({
        graph,
        runtime,
        logs,
        knowledge,
        context
      });

    Events.emit({
      investigationId,
      type:"ANALYSIS_COMPLETED",
      actor:"AnalysisPipeline",
      details:"Runtime and dependency analysis completed"
    });


    const mode = String(
      input.mode || input.objectiveType || input.category || "ROOT_CAUSE_ANALYSIS"
    ).toUpperCase();

    const repairRequested =
      mode === "REPAIR" ||
      mode === "FIX" ||
      mode === "PATCH";

    if (!repairRequested) {
      State.update(
        investigationId,
        "EVIDENCE_READY"
      );

      const report = Report.execute({
        investigationId,
        intake,
        graph,
        runtime,
        logs,
        knowledge,
        diagnosis,
      });

      Events.emit({
        investigationId,
        type:"AUTOMATED_DIAGNOSIS_COMPLETED",
        actor:"AfriDebugOrchestrator",
        details:`Automated ${mode} investigation completed without entering repair workflow`
      });

      return {
        investigationId,
        mode,
        status:"AUTOMATED_DIAGNOSIS_COMPLETED",
        state:State.get(investigationId),
        events:Events.list(investigationId),
        artifacts:{
          intake,
          graph,
          runtime,
          logs,
          knowledge,
          diagnosis,
          report
        }
      };
    }

    const patch = Patch.execute({
      investigationId,
      issue:(logs.errors?.[0]?.message || "No runtime error detected")
    });


    State.update(
      investigationId,
      "PATCH_READY"
    );


    Events.emit({
      investigationId,
      type:"PATCH_READY",
      actor:"PatchPlanningWorker",
      details:"Patch strategy generated"
    });


    State.update(
      investigationId,
      "VERIFYING"
    );


    const verification = Verify.execute({
      investigationId,
      patchId:patch.id
    });


    Events.emit({
      investigationId,
      type:"VERIFICATION_PASSED",
      actor:"VerificationEngine",
      details:"Patch verification completed"
    });


    State.update(
      investigationId,
      "EVIDENCE_READY"
    );


    const report = Report.execute({
      investigationId,
      intake,
      graph,
      runtime,
      logs,
      knowledge,
      diagnosis,
      patch,
      verification
    });


      const approval = ApprovalQueue.submit({
        planId:patch.id,
        incidentId:investigationId,
        action:"repair"
      });

      State.update(
        investigationId,
        "WAITING_FOR_HUMAN_APPROVAL"
      );

      Events.emit({
        investigationId,
        type:"HUMAN_APPROVAL_PENDING",
        actor:"AfriDebugRepairApprovalQueue",
        details:"Verified investigation blocked pending human repair approval"
      });

      return {
        investigationId,
        status:"WAITING_FOR_HUMAN_APPROVAL",
        approval,
        state:State.get(investigationId),
        events:Events.list(investigationId),
        artifacts:{
          intake,
          graph,
          runtime,
          logs,
          knowledge,
          diagnosis,
          patch,
          verification,
          report
        }
      };

    } finally {
      Acquisition.cleanup(acquisition?.cleanupPath);
    }
  }

};


export default AfriDebugOrchestrator;
