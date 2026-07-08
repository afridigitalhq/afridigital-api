export class TimelineViewer {

 constructor(){
  this.timeline=[];
 }

 add(record){
  this.timeline.push(record);
 }

 view(){
  return this.timeline;
 }

}

export const timelineViewer =
new TimelineViewer();
