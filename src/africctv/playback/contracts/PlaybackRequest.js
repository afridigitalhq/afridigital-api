export class PlaybackRequest {

  constructor({
    evidenceId,
    cameraId,
    timestamp
  }){

    this.type="playback.request";
    this.evidenceId=evidenceId;
    this.cameraId=cameraId;
    this.timestamp=timestamp;
    this.status="REQUESTED";
  }

}

export function createPlaybackRequest(data){
  return new PlaybackRequest(data);
}

console.log("▶️ Playback Request Contract READY");
