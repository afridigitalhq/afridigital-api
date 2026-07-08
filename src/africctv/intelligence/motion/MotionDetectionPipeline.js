export class MotionDetectionPipeline {

  constructor(){
    this.events = [];
  }

  process(frame){

    const motionLevel = frame.motion ?? 0;

    const event = {
      cameraId: frame.cameraId,
      type:"MOTION",
      detected: motionLevel > 0.5,
      confidence: motionLevel,
      timestamp: Date.now()
    };

    this.events.push(event);

    return event;
  }

  history(){
    return this.events;
  }
}

export const motionDetectionPipeline = new MotionDetectionPipeline();
