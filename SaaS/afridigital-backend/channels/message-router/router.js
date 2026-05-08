module.exports = {
  route: async ({ user, message }) => {
    const text = (message || "").toLowerCase();

    if (text.includes("send")) {
      return { flow: "wallet.transfer" };
    }

    if (text.includes("earn")) {
      return { flow: "marketplace.earn" };
    }

    if (text.includes("ai")) {
      return { flow: "assistant.chat" };
    }

    return { flow: "assistant.general" };
  }
};
