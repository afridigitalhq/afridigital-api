const { bus } = require("../events/event.bus.cjs");

console.log("⚙️ WORKER CLUSTER ONLINE");

bus.subscribe("afridigital-events", (msg) => {
  const data = JSON.parse(msg);

  if (data.event === "JOB_CREATED") {
    console.log("🧠 Worker received job:", data.payload);
  }

  if (data.event === "TASK_ASSIGNED") {
    console.log("🚀 Executing task:", data.payload);
  }
});
