require("dotenv").config({ path: require("path").resolve(__dirname, "../../../../.env"), override: true });
require("dotenv").config();

const required = [
  "API_URL",
  "FRONTEND_URL"
];

let failed = false;

for (const key of required) {
  if (!process.env[key]) {
    console.log(`❌ Missing ENV: ${key}`);
    failed = true;
  } else {
    console.log(`✅ ENV OK: ${key}`);
  }
}

if (failed) {
  console.log("\n🛑 ENV VALIDATION FAILED\n");
  process.exit(1);
}

console.log("\n🔐 ENV VALIDATION PASSED\n");
