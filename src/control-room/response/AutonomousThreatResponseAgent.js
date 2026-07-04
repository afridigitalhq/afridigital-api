import { cameraActionGuard } from "../../cameras/guard/CameraActionGuard.js";
import { socPolicyEngine } from "../policy/SOCPolicyEngine.js";
import { socAutopilotEngine } from "../autopilot/SOCAutopilotEngine.js";

export class AutonomousThreatResponseAgent {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.active = true;
  }

  start() {
    if (!this.eventBus?.on) return;

    this.eventBus.on("EVENT", (event) => this._handle(event));
  }

  async _handle(event) {
    if (!this.active) return;

    // 🔥 instant detection layer
    if (event.severity === "CRITICAL" || event.type === "INTRUSION") {

      const context = {
        type: event.type,
        severity: event.severity,
        cameraId: event.cameraId,
        timestamp: event.timestamp
      };

      // 🔐 guard check
      const guard = cameraActionGuard.validate("system", context);

      // 📜 policy check
      const policy = socPolicyEngine.evaluate(context);

      if (!guard.allowed || policy?.blocked) {
        this._log("BLOCKED_RESPONSE", context);
        return;
      }

      // 🤖 immediate containment actions
      if (event.type === "INTRUSION") {
        this._emit({
          type: "LOCKDOWN_TRIGGER",
          cameraId: event.cameraId
        });
      }

      if (event.type === "STREAM_FAILURE") {
        this._emit({
          type: "SWITCH_BACKUP_STREAM",
          cameraId: event.cameraId
        });
      }

      // 🧠 escalate complex cases to autopilot
      const result = await socAutopilotEngine.run(60000, "system");

      this._log("AUTOPILOT_ESCALATION", result);
    }
  }

  _emit(action) {
    this.eventBus.emit("CONTROL_ACTION", action);
  }

  _log(type, data) {
    this.eventBus.emit("THREAT_RESPONSE_LOG", {
      type,
      data,
      timestamp: Date.now()
    });
  }

  stop() {
    this.active = false;
  }
}

export const autonomousThreatResponseAgent = new AutonomousThreatResponseAgent();
