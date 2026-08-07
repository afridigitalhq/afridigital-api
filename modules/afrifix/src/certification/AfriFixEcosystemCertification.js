import { AfriFixEcosystemValidator } from "../ecosystem/AfriFixEcosystemValidator.js";

const validator = new AfriFixEcosystemValidator();

const result = validator.validate([
  "afridebug",
  "afrifix",
  "core",
  "platform",
  "afriai"
]);

console.log("🌍 AfriFix Ecosystem Certification");
console.log("================================");
console.log(JSON.stringify(result, null, 2));
console.log("================================");

console.log(
  result.status === "PASSED"
    ? "🟢 Ecosystem Certification PASSED"
    : "🔴 Ecosystem Certification FAILED"
);
