const events=[];

export class AfriSOCBridge {

 ingest(event){

  events.push({
   ...event,
   source:"AFRICCTV_SOC"
  });

 }


 stream(){

  return events;

 }

}


export const afriSOCBridge =
new AfriSOCBridge();
