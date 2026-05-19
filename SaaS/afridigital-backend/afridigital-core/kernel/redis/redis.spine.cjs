console.log("\n🧠 REDIS EVENT SPINE (SIMULATED LAYER)\n");

module.exports = {
  publish: (event, data) => console.log("PUBLISH:", event, data),
  subscribe: (event) => console.log("SUBSCRIBE:", event)
};
