const fs = require("fs");

function train() {
  console.log("\n🧠 AI SELF-TRAINING CYCLE START");

  const logs = fs.existsSync("./logs.json")
    ? JSON.parse(fs.readFileSync("./logs.json"))
    : [];

  const summary = {
    jobs: logs.filter(l => l.type === "JOB_POSTED").length,
    ads: logs.filter(l => l.type === "AD_POSTED").length,
    wallet: logs.filter(l => l.type.includes("WALLET")).length
  };

  console.log("📊 LEARNED STATE:", summary);

  fs.writeFileSync("./ai_model_snapshot.json", JSON.stringify(summary, null, 2));

  console.log("✅ AI UPDATED FROM SYSTEM LOGS");
}

train();
