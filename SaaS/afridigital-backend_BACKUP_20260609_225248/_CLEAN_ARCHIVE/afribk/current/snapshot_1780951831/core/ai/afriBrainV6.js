function explain(issue, snapshot) {
  return `
🧠 AFRI AI DIAGNOSIS

Issue: ${issue}

Analysis:
- serverRunning: ${snapshot.serverRunning}
- kernelExists: ${snapshot.kernelExists}

Recommendation:
System executed safe auto-repair routine.
If issue persists, escalate to manual inspection.
  `;
}

module.exports = { explain };
