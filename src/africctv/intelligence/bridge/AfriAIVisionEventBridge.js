export class AfriAIVisionEventBridge {

  constructor(){
    this.queue=[];
  }

  ingest(event){

    const intelligenceEvent={
      source:"africctv",
      target:"afriai",
      type:event.type,
      cameraId:event.cameraId,
      timestamp:event.timestamp,
      payload:event
    };

    this.queue.push(intelligenceEvent);

    return intelligenceEvent;
  }

  events(){
    return this.queue;
  }
}

export const afriAIVisionEventBridge = new AfriAIVisionEventBridge();
