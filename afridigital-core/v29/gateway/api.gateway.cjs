const express = require("express");

const app = express();
app.use(express.json());

console.log("\n🌐 API GATEWAY ONLINE\n");

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    system: "V29"
  });
});

app.listen(4000, () => {
  console.log("🚀 API GATEWAY RUNNING :4000");
});
