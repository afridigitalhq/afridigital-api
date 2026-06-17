const hookedListen = require("../core/runtime/hooks/listen.hook");
const express = require("express");
const app = express();
app.use(express.json());

// HEALTH
app.get("/health", (req,res)=>res.json({ok:true,service:"afrios"}));

// WHATSAPP KERNEL (single entry)
const whatsapp = require("./africore/kernel/connectivity.kernel");
app.use("/webhook", whatsapp);
app.use("/whatsapp", whatsapp);

// AFRIAGENT CORE
const { afriagentKernel } = require("./africore/kernel/afriagent/kernel");
const { execute } = require("./africore/kernel/afriagent/executor");
const planner = require("./africore/kernel/afriagent/planner.contract");

app.post("/afriagent/test", async (req,res)=>{
  try{
    const plan = planner.normalizePlan({
      user: req.body?.user || "2347060553158",
      text: req.body?.text || "test"
    });

    const result = await afriagentKernel(
      { user: plan.payload.to, text: plan.payload.message },
      { planner:{buildPlan:()=>plan}, executor:{execute} }
    );

    res.json({ok:true,result});
  }catch(e){
    res.json({ok:false,error:e.message});
  }
});

// START (Render-safe)
const PORT = process.env.PORT || 3000;
app.listen .listen(.listen( hookedListen(PORT, "0.0.0.0", ()=>console.log("🚀 AFRIOS ONLINE", PORT));
