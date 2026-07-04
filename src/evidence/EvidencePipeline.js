import { eventBus } from "../events/EventBus.js";

export class EvidencePipeline {
  constructor() {
    this.records = new Map();
  }

  createIncidentBundle(incident) {
    const id = incident?.id || `inc-${Date.now()}`;

    const bundle = {
      id,
      video: null,   // MP4 reference
      audio: null,   // MP3 report
      pdf: null,     // PDF case file
      timeline: incident?.timeline || [],
      metadata: incident || {},
      createdAt: Date.now()
    };

    this.records.set(id, bundle);

    eventBus.emit("EVIDENCE_CREATED", bundle);

    return bundle;
  }

  attachVideo(id, videoRef) {
    const b = this.records.get(id);
    if (!b) return null;
    b.video = videoRef;
    return b;
  }

  attachAudio(id, audioRef) {
    const b = this.records.get(id);
    if (!b) return null;
    b.audio = audioRef;
    return b;
  }

  attachPDF(id, pdfRef) {
    const b = this.records.get(id);
    if (!b) return null;
    b.pdf = pdfRef;
    return b;
  }

  getBundle(id) {
    return this.records.get(id) || null;
  }

  getAll() {
    return Array.from(this.records.values());
  }
}

export const evidencePipeline = new EvidencePipeline();
