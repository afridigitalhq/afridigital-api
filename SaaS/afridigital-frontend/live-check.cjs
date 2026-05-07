const https = require("https");
const { runKernel } = require("../afridigital-backend/modules/ai-engine/truthKernel");

const URL = "https://afridigital-hub.onrender.com";

https.get(URL, (res) => {
  let data = "";

  res.on("data", chunk => data += chunk);

  res.on("end", () => {
    console.log("🌍 Checking LIVE site...");
    runKernel(data);
  });

}).on("error", (err) => {
  console.log("⚠️ Live check failed:", err.message);
});
