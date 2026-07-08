const events=[];

export class AfriDigitalEventBridge{

 publish(event){

  events.push({
   source:"africctv",
   ...event,
   timestamp:Date.now()
  });

 }


 stream(){

  return events;

 }

}


export const afriDigitalEventBridge =
new AfriDigitalEventBridge();
