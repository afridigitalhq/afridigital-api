export class PlaybackRepository {

  constructor(){
    this.requests=[];
  }

  save(request){
    this.requests.push(request);
    return request;
  }

  findAll(){
    return this.requests;
  }

}

export const playbackRepository =
new PlaybackRepository();

console.log("▶️ Playback Repository READY");
