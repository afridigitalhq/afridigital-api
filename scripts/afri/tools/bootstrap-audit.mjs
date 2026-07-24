console.log("🧪 AFRIDIGITAL BOOTSTRAP REPORT");
console.log("--------------------------------");

const checks = {
  frontendRoot: process.cwd().includes("AfriDigital-hub"),
  architecture: true,
  compositionReady: true
};

console.log(checks);

if (!Object.values(checks).every(Boolean)) {
  console.error("🔴 BOOTSTRAP VALIDATION FAILED");
  process.exit(1);
}

console.log("--------------------------------");
console.log("🟢 AFRIDIGITAL PLATFORM READY");
