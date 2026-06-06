import { identity } from "../../identity/identity.js";

export const whatsappIdentityBridge = {
  init() {},

  bind(phone) {
    identity.set({
      id: "wa_" + phone,
      role: phone === "ADMIN_NUMBER" ? "admin" : "user",
      phone
    });

    console.log("📲 WhatsApp Identity Bound:", phone);
  }
};
