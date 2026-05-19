const modules = {
  timeMachine: { name: "Time Machine", scope: "core" },
  userIntel: { name: "User Intelligence", scope: "core" },
  whatsappOS: { name: "WhatsApp OS", scope: "comm" },
  finance: { name: "Finance Engine", scope: "business" },
  revenue: { name: "Revenue Engine", scope: "business" },
  risk: { name: "Risk Monitor", scope: "security" },
  kernel: { name: "Kernel Health", scope: "system" },
  stream: { name: "Stream Bridge", scope: "system" },
  watchdog: { name: "Watch Dog", scope: "system" },
  plugins: { name: "Plug & Play Modules", scope: "ext" },

  aiCore: { name: "AI Operations Core", scope: "core" },
  queue: { name: "Queue Engine", scope: "system" },
  audit: { name: "Audit Ledger", scope: "security" },
  shield: { name: "Security Shield", scope: "security" },
  integrations: { name: "Integration Hub", scope: "comm" }
};

function listModules() {
  return Object.entries(modules).map(([id, m]) => ({ id, ...m }));
}

module.exports = { modules, listModules };
