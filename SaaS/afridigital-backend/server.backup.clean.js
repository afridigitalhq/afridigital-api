require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/health", (req,res)=>{
  res.json({ ok:true, service:"afrios" });
});

// Core routes
const runtimeRoutes = require("./routes/runtime");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin.routes");

// Mount points
app.use("/admin/control-plane", adminRoutes);
app.use("/webhook", require("./routes/webhook"));
app.use("/api", runtimeRoutes);
app.use("/api/ai", aiRoutes);

// Safe startup
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 AfriOS running on port", PORT);
});
