import { commandFirewall } from "./security/firewall/commandFirewall.js";
import { toolSandbox } from "./security/sandbox/toolSandbox.js";

export const commandBus = {
  init() {},

  execute(command) {
    const check = commandFirewall.validate(command);

    if (!check.ok) {
      console.warn("❌ BLOCKED COMMAND:", check.reason);
      return;
    }

    // TOOL EXECUTION VIA SANDBOX ONLY
    if (command.tool) {
      return toolSandbox.run(command.tool, command.payload);
    }

    console.log("✅ COMMAND EXECUTED:", command);
  }
};
