const express = require("express");
const { createJob } = require("../economy/economy.engine.cjs");

const app = express();
app.use(express.json());

console.log("🌐 API GATEWAY ACTIVE");

app.post("/job/create", (req, res) => {
  const result = createJob(req.body);
  res.json(result);
});

app.listen(3000, () => {
  console.log("🚀 Gateway running on port 3000");
});
