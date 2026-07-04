import { eventBus } from "../../events/EventBus.js";

export class AutoResponseEngine {
  constructor(caseEngine, controlRoom) {
    this.caseEngine = caseEngine;
    this.controlRoom = controlRoom;
    this.rules = new Map();

    this.init();
  }

  init() {
    eventBus.on("CASE_CREATED", (caseFile) => {
      this.evaluate(caseFile);
    });
  }

  setRule(severity, action) {
    this.rules.set(severity, action);
  }

  evaluate(caseFile) {
    const action = this.rules.get(caseFile.severity);

    if (!action) return;

    return this.execute(action, caseFile);
  }

  execute(action, caseFile) {
    const result = {
      caseId: caseFile.id,
      action,
      status: "EXECUTED",
      timestamp: Date.now()
    };

    switch (action) {
      case "ALERT_CONTROL_ROOM":
        this.controlRoom.emit?.("ALERT", caseFile);
        break;

      case "FREEZE_CAMERA":
        this.controlRoom.emit?.("FREEZE_FEED", caseFile.cameraId);
        break;

      case "ESCALATE_INCIDENT":
        this.controlRoom.emit?.("ESCALATION", caseFile);
        break;

      default:
        break;
    }

    return result;
  }
}
