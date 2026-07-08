import { createPlaybackRequest } from "../contracts/PlaybackRequest.js";
import { timelineViewer } from "../TimelineViewer.js";

export class AfriCCTVPlaybackBridge {

  requestFromEvidence(evidence){

    const request = createPlaybackRequest({
      evidenceId:evidence.id,
      cameraId:evidence.cameraId,
      timestamp:evidence.timestamp
    });

    timelineViewer.add({
      cameraId:evidence.cameraId,
      event:evidence.type,
      timestamp:evidence.timestamp,
      playbackRequest:request.type
    });

    return request;
  }

}

export const africctvPlaybackBridge =
new AfriCCTVPlaybackBridge();

console.log("▶️ AfriCCTV Playback Bridge READY");
