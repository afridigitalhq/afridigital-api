const bus = require('../../realtime/event.stream');

function handleJobs(payload) {
  return {
    type: "JOB_CREATED",
    jobId: "job_" + Date.now(),
    data: payload
  };
}

function handleServices(payload) {
  return {
    type: "SERVICE_REQUESTED",
    serviceId: "svc_" + Date.now(),
    data: payload
  };
}

function handleEarn(payload) {
  return {
    type: "EARN_ACTION",
    reward: Math.floor(Math.random() * 10),
    data: payload
  };
}

function handleWallet(payload) {
  return {
    type: "WALLET_EVENT",
    balanceDelta: Math.floor(Math.random() * 20),
    data: payload
  };
}

bus.on("JOB_REQUEST", (e) => {
  const result = handleJobs(e);
  bus.emit("ECONOMY_EVENT", result);
});

bus.on("SERVICE_REQUEST", (e) => {
  const result = handleServices(e);
  bus.emit("ECONOMY_EVENT", result);
});

bus.on("EARN_REQUEST", (e) => {
  const result = handleEarn(e);
  bus.emit("ECONOMY_EVENT", result);
});

bus.on("WALLET_REQUEST", (e) => {
  const result = handleWallet(e);
  bus.emit("ECONOMY_EVENT", result);
});

console.log("🧠 ECONOMY ENGINE ACTIVE (READ ONLY)");
