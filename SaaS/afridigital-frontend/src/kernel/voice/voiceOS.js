import { aiCopilot } from "../controller/aiCopilot.js";
import { authContext } from "../auth/authContext.js";

export const voiceOS = {
  init() {},

  listen(text) {
    const role = authContext.getRole();

    // basic guard
    if (!text) return;

    console.log("🎤 VOICE INPUT:", text, "ROLE:", role);

    return aiCopilot.run(text);
  }
};
