import { commandBus } from "../../commandBus.js";

export const whatsappBridge = {
  init() {},

  handleMessage(msg) {
    if (!msg || !msg.text) return;

    const role = msg.role || "user";

    // ROLE GATE
    if (role !== "admin" && msg.text.includes("admin:")) {
      return console.warn("❌ WHATSAPP BLOCKED: insufficient role");
    }

    return commandBus.execute({
      type: "WHATSAPP_COMMAND",
      payload: msg
    });
  }
};
