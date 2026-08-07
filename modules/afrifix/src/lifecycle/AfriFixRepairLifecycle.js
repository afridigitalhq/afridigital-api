import { AfriFixRepairSessionManager } from "../sessions/AfriFixRepairSessionManager.js";
import { AfriFixSessionEvidenceAdapter } from "../evidence/AfriFixSessionEvidenceAdapter.js";

export class AfriFixRepairLifecycle {
  constructor() {
    this.sessions = new AfriFixRepairSessionManager();
    this.evidence = new AfriFixSessionEvidenceAdapter();
  }

  execute(context = {}) {
    const session = this.sessions.create(context);

    [
      "INTAKE_STARTED",
      "ANALYSIS_COMPLETED",
      "REPAIR_PLAN_CREATED",
      "PREVIEW_GENERATED",
      "WAITING_APPROVAL"
    ].forEach(event => {
      this.sessions.update(session, event);
    });

    const evidence = this.evidence.save(session);

    return {
      component: "AfriFix Repair Lifecycle",
      status: "READY",
      session,
      evidence,
      stages: [
        "Intake",
        "Analysis",
        "Decision",
        "Planning",
        "Preview",
        "Approval",
        "Execution",
        "Verification",
        "Evidence"
      ]
    };
  }
}
