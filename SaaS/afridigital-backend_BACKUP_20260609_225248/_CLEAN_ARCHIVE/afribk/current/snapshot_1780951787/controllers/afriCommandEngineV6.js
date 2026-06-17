const { isAdmin } = require("../middleware/afriAuthV2");
const { systemSnapshot, detectIssues } = require("../core/selfheal/monitor");
const { repair } = require("../core/selfheal/repair");
const { explain } = require("../core/ai/afriBrainV6");

async function runCommand(req, sendWhatsAppMessage) {
  const from = req.body?.from;
  const text = (req.body?.text || "").trim().toLowerCase();

  if (!isAdmin(req)) {
    return sendWhatsAppMessage(from, "❌ Unauthorized");
  }

  // ⚡ STATUS
  if (text === "afri heal") {
    const snap = systemSnapshot();
    const issues = detectIssues(snap);

    if (issues.length === 0) {
      return sendWhatsAppMessage(from, "🟢 System healthy");
    }

    const results = [];

    for (const issue of issues) {
      const fix = repair(issue);
      results.push(`${issue}: ${fix}`);
    }

    return sendWhatsAppMessage(from, results.join("\n"));
  }

  // ⚡ DIAGNOSTIC ONLY
  if (text === "afri diagnose") {
    const snap = systemSnapshot();
    const issues = detectIssues(snap);

    return sendWhatsAppMessage(
      from,
      explain(issues.join(", ") || "NONE", snap)
    );
  }

  // ⚡ STATUS
  if (text === "afri status") {
    return sendWhatsAppMessage(from, JSON.stringify(systemSnapshot(), null, 2));
  }

  return sendWhatsAppMessage(from, "⚠️ Unknown command");
}

module.exports = { runCommand };
