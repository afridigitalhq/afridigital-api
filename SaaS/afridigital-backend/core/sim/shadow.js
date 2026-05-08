module.exports = {
  test: (plan) => {
    console.log("🧪 Simulating plan:", plan);
    return { safe: true, impact: "positive" };
  }
};
