import State from "../state/AfriDebugInvestigationStateManager.js";
import Events from "../events/AfriDebugEventStream.js";

import Intake from "../workers/AfriDebugRepositoryIntakeWorker.js";
import Graph from "../workers/AfriDebugDependencyGraphWorker.js";
import Runtime from "../workers/AfriDebugRuntimeInspectorWorker.js";
import LogAnalyzer from "../workers/AfriDebugLogAnalyzerWorker.js";
import Knowledge from "../workers/AfriDebugKnowledgeMatcherWorker.js";
import Patch from "../workers/AfriDebugPatchPlanningWorker.js";
import Verify from "../workers/AfriDebugVerificationWorker.js";
import Report from "../workers/AfriDebugEvidenceReportWorker.js";
import Delivery from "../workers/AfriDebugDeliveryPackageWorker.js";
import ApprovalGate from "../investigation/HumanApprovalGate.js";


const AfriDebugOrchestrator = {

  run(input = {}) {

    const investigationId =
      `INV-${Date.now()}`;


    State.create({
      investigationId
    });


    Events.emit({
      investigationId,
      type:"INVESTIGATION_CREATED",
      actor:"AfriDebugOrchestrator",
      details:"Investigation initialized"
    });


    State.update(
      investigationId,
      "INTAKE_RUNNING"
    );


    const intake = Intake.execute({
      investigationId,
      ...input.repository
    });


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
      repository:intake.repository
    });


    const runtime = Runtime.execute({
      investigationId
    });


    const logs = LogAnalyzer.execute({
      investigationId,
      source:"runtime"
    });


    const knowledge = Knowledge.execute({
      investigationId,
      issue:logs.errors[0].message
    });


    Events.emit({
      investigationId,
      type:"ANALYSIS_COMPLETED",
      actor:"AnalysisPipeline",
      details:"Runtime and dependency analysis completed"
    });


    const patch = Patch.execute({
      investigationId,
      issue:logs.errors[0].message
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
      investigationId
    });


    const approval = ApprovalGate.request({
      investigationId,
      patchId: patch.id
    });

    if (approval.status !== "APPROVED") {

      State.update(
        investigationId,
        "WAITING_FOR_HUMAN_APPROVAL"
      );

      Events.emit({
        investigationId,
        type:"HUMAN_APPROVAL_PENDING",
        actor:"HumanApprovalGate",
        details:"Delivery blocked pending human approval"
      });

      return {

        investigationId,

        status:"WAITING_FOR_HUMAN_APPROVAL",

        approval,

        state:State.get(investigationId),

        artifacts:{
          intake,
          graph,
          runtime,
          logs,
          knowledge,
          patch,
          verification,
          report
        }

      };

    }

    const delivery = Delivery.execute({
      investigationId,
      clientId:input.clientId || null,
      reportId:report.id
    });


    Events.emit({
      investigationId,
      type:"DELIVERY_READY",
      actor:"DeliveryEngine",
      details:"Client evidence package generated"
    });


    State.update(
      investigationId,
      "DELIVERED"
    );


    return {

      investigationId,

      status:"COMPLETED",

      state:State.get(investigationId),

      events:Events.list(investigationId),

      artifacts:{
        intake,
        graph,
        runtime,
        logs,
        knowledge,
        patch,
        verification,
        report,
        delivery
      }

    };

  }

};


export default AfriDebugOrchestrator;
