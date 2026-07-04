import { chainOfCustody } from "../custody/ChainOfCustody.js";

export class CaseBundleEngine {
  constructor() {
    this.cases = new Map();
  }

  createCase(incident, clip, extras = {}) {
    const id = `case-${incident.id}`;

    const evidence = {
      incident,
      clip,
      extras,
      createdAt: Date.now()
    };

    const custody = chainOfCustody.sealEvidence({
      id,
      type: "CASE_BUNDLE",
      cameraId: incident.cameraId,
      payload: evidence
    });

    const caseFile = {
      id,
      incidentId: incident.id,
      cameraId: incident.cameraId,
      clipFile: clip?.file || null,
      severity: incident.severity || "UNKNOWN",
      status: "SEALED",
      custodyHash: custody.hash,
      timestamp: custody.timestamp
    };

    this.cases.set(id, caseFile);

    return caseFile;
  }

  getCase(id) {
    return this.cases.get(id) || null;
  }

  getAllCases() {
    return Array.from(this.cases.values());
  }

  exportCase(id) {
    const caseFile = this.getCase(id);
    if (!caseFile) return null;

    return {
      ...caseFile,
      exported: true,
      exportFormat: "AFRIMONITOR_CASE_V1"
    };
  }
}

export const caseBundleEngine = new CaseBundleEngine();
