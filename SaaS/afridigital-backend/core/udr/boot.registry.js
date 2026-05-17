let booted = false;

const whatsappPipeline = require("../services/pipeline/whatsappPipeline");

function boot(registry = []) {

  if (booted) {
    return { ok: false, reason: "duplicate_blocked" };
  }

  booted = true;

  console.log("🧠 UDR BOOT REGISTRY ACTIVE (v2.4)");

  const loaded = [];
  const failed = [];

  const extendedRegistry = [
    ...registry,
    {
      name: "whatsapp-pipeline",
      init: async () => {
        console.log("📡 WhatsApp Pipeline ATTACHED");
        try {
          await whatsappPipeline({ mode: "boot_attach" });
        } catch (e) {
          console.log("⚠️ WhatsApp Pipeline init failed:", e.message);
        }
      }
    }
  ];

  for (const m of extendedRegistry) {
    try {
      loaded.push(m.name || "module");
      m.init && m.init();
    } catch (e) {
      failed.push({ name: m.name, error: e.message });
    }
  }

  return {
    ok: true,
    loaded,
    failed,
    ts: Date.now()
  };
}

module.exports = { boot };
