module.exports = {
  decide: (event) => {
    console.log("🧠 AI analyzing event:", event.type);

    return {
      action: "monitor",
      risk: "low",
      autoFix: true
    };
  }
};
