import { authContext } from "../auth/authContext.js";
import { signer } from "../signing/signer.js";

export const commandFirewall = {
  validate(command) {
    const role = authContext.getRole();

    // ADMIN GATE
    if (command.scope === "admin" && role !== "admin") {
      return { ok: false, reason: "ADMIN_ONLY_COMMAND" };
    }

    // SIGNATURE GATE
    if (command.signature) {
      const valid = signer.verify(command.payload, command.signature);
      if (!valid) {
        return { ok: false, reason: "INVALID_SIGNATURE" };
      }
    }

    return { ok: true };
  }
};
