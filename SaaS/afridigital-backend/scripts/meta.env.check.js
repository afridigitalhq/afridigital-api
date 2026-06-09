/**
 * 🔍 META ENV VALIDATION FOR RENDER
 */

const required = [
  "WHATSAPP_PHONE_NUMBER_ID",
  "META_ACCESS_TOKEN",
  "WHATSAPP_VERIFY_TOKEN"
];

console.log("🧠 META ENV CHECK START");

let ok = true;

required.forEach(k => {
  if (!process.env[k]) {
    console.log("🔴 MISSING:", k);
    ok = false;
  } else {
    console.log("🟢 OK:", k);
  }
});

console.log(ok ? "🟢 META READY" : "🔴 META NOT READY");
process.exit(ok ? 0 : 1);
