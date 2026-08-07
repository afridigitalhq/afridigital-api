import fs from "fs";

export class AfriFixSessionEvidenceAdapter {
  save(session) {
    const report = {
      component: "AfriFix Session Evidence",
      status: "RECORDED",
      sessionId: session.sessionId,
      project: session.project,
      events: session.history,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      "modules/afrifix/evidence/session-evidence.json",
      JSON.stringify(report, null, 2)
    );

    return report;
  }
}
