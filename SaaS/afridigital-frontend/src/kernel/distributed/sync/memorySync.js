const API = "https://afridigital-api.onrender.com";

export const memorySync = {
  async push(memory) {
    await fetch(API + "/memory/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memory)
    });
  },

  async pull() {
    const res = await fetch(API + "/memory/pull");
    return await res.json();
  }
};
