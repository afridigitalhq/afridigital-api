const express = require("express");
const router = express.Router();

// HEALTH
router.get("/health", (req,res)=>{
  res.json({ ok:true, service:"afrios" });
});

// TEST AGENT
router.post("/afriagent/test", async (req,res)=>{
  try {
    const { afriagentKernel } = require("../afriagent/kernel");
    const { execute } = require("../afriagent/executor");
    const plan = require("../afriagent/planner.contract")
      .normalizePlan({ user:"2347060553158", text:"test" });

    const result = await afriagentKernel(
      { user:"2347060553158", text:"test" },
      { planner:{ buildPlan:()=>plan }, executor:{ execute } }
    );

    res.json({ ok:true, result });
  } catch(e){
    res.json({ ok:false, error:e.message });
  }
});

module.exports = router;
