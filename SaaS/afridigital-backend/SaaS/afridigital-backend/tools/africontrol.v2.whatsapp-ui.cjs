const ADMIN = process.env.WHATSAPP_ADMIN_NUMBER;

function isAdmin(userNumber) {
  if (!ADMIN) return false;
  return String(userNumber) === String(ADMIN);
}

function buildWhatsAppUI(data, userNumber) {
  if (!data || data.type !== "AFRICONTROL_STATUS_V2") {
    return "⚠️ Invalid system response";
  }

  // 🔐 ACCESS CONTROL LAYER (CRITICAL)
  if (!isAdmin(userNumber)) {
    return "🚫 Access denied: Admin only system command";
  }

  const { system, summary, modules } = data;

  const ok = modules.filter(m => m.status === "OK");
  const disabled = modules.filter(m => m.status === "DISABLED");
  const missing = modules.filter(m => m.status === "MISSING");

  const header =
`📡 AFRICONTROL V2 DASHBOARD (ADMIN MODE)
🧠 System: ${system.name}
📊 Health Score: ${system.health_score}%

━━━━━━━━━━━━━━━━━━`;

  const block = (title, items, icon) => {
    if (!items.length) return "";

    return (
      `\n${icon} ${title}\n` +
      items.slice(0, 12)
        .map(m => `${m.icon} ${m.module} → ${m.status}`)
        .join("\n")
    );
  };

  const okBlock = block("HEALTHY MODULES", ok, "🟢");
  const warnBlock = block("PAUSED MODULES", disabled, "🟡");
  const failBlock = block("CRITICAL MODULES", missing, "🔴");

  const footer =
`\n━━━━━━━━━━━━━━━━━━
📦 Total: ${summary.total}
🟢 OK: ${summary.ok}
🟡 Disabled: ${summary.disabled}
🔴 Missing: ${summary.missing}
`;

  return header + okBlock + warnBlock + failBlock + footer;
}

module.exports = { buildWhatsAppUI };
