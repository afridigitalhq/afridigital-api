import { isSOCUser } from "../../auth/socRoles";

export class SOCZeroTrustEngine {

  validate(command, user) {

    const result = {
      allowed: false,
      reason: null
    };

    // 1. Identity check
    if (!user || !user.id) {
      result.reason = "NO_IDENTITY";
      return result;
    }

    // 2. Role trust check
    if (!isSOCUser(user)) {
      result.reason = "INSUFFICIENT_ROLE";
      return result;
    }

    // 3. Command integrity check
    if (!command.type || !command.payload) {
      result.reason = "INVALID_COMMAND_SCHEMA";
      return result;
    }

    // 4. Policy gate (basic rules now, extend later)
    const restricted = ["PANIC_MODE", "ADMIN_ACTION"];

    if (restricted.includes(command.type) && user.role !== "soc_super") {
      result.reason = "POLICY_RESTRICTED";
      return result;
    }

    result.allowed = true;
    return result;
  }
}
