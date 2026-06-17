const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "afrios" });
});

router.post("/afriagent/test", async (req, res) => {
  try {
    const { afriagentKernel } = require("../africore/kernel/afriagent/kernel");
    const { execute } = require("../africore/kernel/afriagent/executor");
    const plan = require("../africore/kernel/afriagent/planner.contract")
      .normalizePlan({ user: "2347060553158", text: "test" });

    const result = await afriagentKernel(
      { user: "2347060553158", text: "test" },
      { planner: { buildPlan: () => plan }, executor: { execute } }
    );

    res.json({ ok: true, result });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

module.exports = router;
