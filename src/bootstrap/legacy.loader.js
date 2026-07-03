export function startLegacy() {
  console.log("🧩 Legacy loader initialized");

  try {
    console.log("🔍 Scanning legacy runtime (safe probe mode)");
    console.log("⚠️ No execution enabled yet");
  } catch (e) {
    console.log("Legacy probe error:", e.message);
  }
}
