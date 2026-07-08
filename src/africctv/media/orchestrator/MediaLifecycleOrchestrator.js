import { cameraStreamGateway } from "../../gateway/stream/CameraStreamGateway.js";
import { recordingEngine } from "../../recording/RecordingEngine.js";
import { timelineViewer } from "../../playback/TimelineViewer.js";
import { evidenceArchiveGovernance } from "../../investigation/archive/EvidenceArchiveGovernance.js";
import { videoEventStore } from "../../analytics/events/VideoEventStore.js";


export class MediaLifecycleOrchestrator {

 coordinate(media){

  return {

   stream:
    cameraStreamGateway.connect
     ? cameraStreamGateway.connect(media)
     : null,

   recording:
    recordingEngine.start
     ? recordingEngine.start(media)
     : null,

   playback:
    timelineViewer.load
     ? timelineViewer.load(media)
     : null,

   archive:
    evidenceArchiveGovernance.review
     ? evidenceArchiveGovernance.review(media)
     : null,

   events:
    videoEventStore.store
     ? videoEventStore.store(media)
     : null,

   coordinatedAt: Date.now()

  };

 }

}


export const mediaLifecycleOrchestrator =
 new MediaLifecycleOrchestrator();
