const events=[];

export class VideoEventStore{

 save(event){

  events.push(event);
  return event;

 }


 all(){

  return events;

 }

}


export const videoEventStore =
new VideoEventStore();
