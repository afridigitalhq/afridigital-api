const { verifySystem } = require("./core/verify/systemVerifier");

function main() {
  const result = verifySystem();
  console.log("\n🚀 AFRI SYSTEM VERIFICATION REPORT");
  console.log("=================================");
  console.log(JSON.stringify(result, null, 2));

  if (result.status !== "HEALTHY") {
    console.log("\n⚠️ System needs attention");
    process.exit(1);
  }

  console.log("\n🟢 System fully healthy");
}

main();
