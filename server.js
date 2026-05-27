const express = require("express");
const app = express();

app.use(express.json());

const { registerKernel } = require("./africore/kernel/connectivity.kernel");
registerKernel(app);

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afriagent-v1"
  });
});

app.post("/afriagent/test", async (req, res) => {
  try {
    const { afriagentKernel } = require("./africore/kernel/afriagent/kernel");
    const { execute } = require("./africore/kernel/afriagent/executor");
    const { normalizePlan } = require("./africore/kernel/afriagent/planner.contract");

    const event = { user: "2347060553158", text: "test" };

    const plan = normalizePlan(event);

    const result = await afriagentKernel(
      event,
      {
        planner: { buildPlan: () => plan },
        executor: { execute }
      }
    );

    res.json({ ok: true, result });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 AFRIAGENT V1 RUNNING:", PORT);
});
// deploy trigger 1779876956
