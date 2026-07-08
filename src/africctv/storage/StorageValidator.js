import { recordingRepository } from "./repositories/RecordingRepository.js";
import { evidenceRepository } from "./repositories/EvidenceRepository.js";
import { playbackRepository } from "./repositories/PlaybackRepository.js";

export function validateStorage(){

 const recording = recordingRepository.save({
  cameraId:"cam01",
  type:"VIDEO_FRAME",
  timestamp:Date.now()
 });

 const evidence = evidenceRepository.save({
  id:"evidence-test",
  cameraId:"cam01",
  type:"MOTION",
  timestamp:Date.now()
 });

 const playback = playbackRepository.save({
  type:"playback.request",
  evidenceId:evidence.id,
  cameraId:evidence.cameraId,
  status:"REQUESTED"
 });

 return {
  recordingValid:Boolean(recording),
  evidenceValid:Boolean(evidence),
  playbackValid:Boolean(playback),
  recordings:recordingRepository.findAll().length,
  evidence:evidenceRepository.findAll().length,
  playback:playbackRepository.findAll().length,
  status:
   recording && evidence && playback
   ? "STORAGE_READY"
   : "FAILED"
 };
}

console.log("🔒 AfriCCTV Storage Validator READY");
