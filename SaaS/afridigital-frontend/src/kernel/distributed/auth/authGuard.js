import { identity } from "../../identity/identity.js";

export const authGuard = {
  validate(command) {
    const user = identity.get();

    if (!user) {
      return { ok: false, reason: "NO_IDENTITY" };
    }

    if (command.scope === "admin" && user.role !== "admin") {
      return { ok: false, reason: "UNAUTHORIZED_IDENTITY" };
    }

    return { ok: true };
  }
};
