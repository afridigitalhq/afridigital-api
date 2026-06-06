import { authContext } from "./auth/authContext.js";

export const intentParser = {
  init() {},

  parse(text) {
    const t = text.toLowerCase();
    const role = authContext.getRole();

    // ADMIN INTENTS
    if (t.includes("logs") || t.includes("system")) {
      return {
        type: "OPEN_WINDOW",
        payload: { id: "systemLogs" },
        permission: "ADMIN_ONLY"
      };
    }

    // USER INTENTS
    if (t.includes("dashboard")) {
      return {
        type: "OPEN_WINDOW",
        payload: { id: "dashboard" },
        permission: "USER"
      };
    }

    return {
      type: "UNKNOWN",
      payload: { text },
      permission: "USER"
    };
  }
};
