import { eventBus } from "../../events/eventBus.js";

const API = "https://afridigital-api.onrender.com";

export const backendSync = {
  async pushState(state) {
    try {
      await fetch(API + "/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });
    } catch (e) {
      console.warn("⚠️ SYNC FAILED");
    }
  },

  async fetchState() {
    try {
      const res = await fetch(API + "/state");
      return await res.json();
    } catch {
      return null;
    }
  }
};
