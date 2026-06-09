const aiRoutes=require('./routes/ai');
const runtimeRoutes=require('./routes/runtime');
require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req,res)=>res.json({ok:true,service:"afrios"}));

app.post("/afriagent/test", async (req,res)=>{
  try {
    const { afriagentKernel } = require("./africore/kernel/afriagent/kernel");
    const { execute } = require("./africore/kernel/afriagent/executor");
    const plan = require("./africore/kernel/afriagent/planner.contract").normalizePlan({
      user:"2347060553158",
      text:"test"
    });

    const result = await afriagentKernel(
      {user:"2347060553158",text:"test"},
      {planner:{buildPlan:()=>plan},executor:{execute}}
    );

    res.json({ok:true,result});
  } catch(e){
    res.json({ok:false,error:e.message});
  }
});

match => match.includes(") => match => {
  console.log("🚀 AfriOS running on port", PORT);
});


const adminRoutes = require("./routes/admin.routes");
app.use("/admin/control-plane", adminRoutes);

// AFRI WEBHOOK
app.use("/webhook", require("./routes/webhook"));

app.use('/api', runtimeRoutes);
app.use('/api/ai', aiRoutes);
