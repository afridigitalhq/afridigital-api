const http = require('./core/http/app');


http.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Render service running on", PORT);
});

app.listen(PORT, "0.0.0.0", () => console.log("🚀 Render service running on", PORT));
app.get('/health',(req,res)=>res.json({ok:true,service:'afridigital-api'}));
app.get('/metrics',(req,res)=>res.json({uptime:process.uptime(),memory:process.memoryUsage(),status:'ok'}));