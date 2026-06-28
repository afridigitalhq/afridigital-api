import { SOCZeroTrustEngine } from "./socZeroTrustEngine";
import { SOCSandbox } from "./socExecutionSandbox";
import { SOCAuditLogger } from "./socAuditLogger";

export class SOCCommandOrchestrator {

  constructor() {
    this.engine = new SOCZeroTrustEngine();
    this.sandbox = new SOCSandbox();
    this.logger = new SOCAuditLogger();
  }

  async run(command, user) {

    // STEP 1: validate
    const validation = this.engine.validate(command, user);

    if (!validation.allowed) {
      this.logger.log({
        command,
        status: "BLOCKED",
        reason: validation.reason,
        user
      });

      return { error: validation.reason };
    }

    // STEP 2: sandbox execution
    const result = await this.sandbox.execute(command);

    // STEP 3: audit log
    this.logger.log({
      command,
      status: "EXECUTED",
      result,
      user
    });

    return result;
  }
}
