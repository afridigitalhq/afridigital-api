export async function probeKernel() {
  try {
    console.log("🧠 Kernel probe active (SAFE SIGNAL MODE)");

    // DO NOT IMPORT LEGACY CODE
    // Just check existence of system boundary

    const fs = await import("fs");

    const exists = fs.existsSync(
      "./src/legacy/africore/runtime/server.boot.cjs"
    );

    console.log("✔ Kernel boundary detected:", exists);

    return true;

  } catch (e) {
    console.log("Kernel probe failed:", e.message);
    return false;
  }
}
