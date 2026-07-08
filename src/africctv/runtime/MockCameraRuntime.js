const cameras = [
  {id:1,name:"Camera 1",status:"LIVE",motion:0,zone:"A"},
  {id:2,name:"Camera 2",status:"LIVE",motion:0,zone:"B"},
  {id:3,name:"Camera 3",status:"LIVE",motion:0,zone:"C"}
];

let rotationIndex = 0;
let frameSequence = 0;

export function tickMockCameras(){

  cameras.forEach(camera=>{
    camera.motion = Number(Math.random().toFixed(2));
  });

  return cameras;
}

export function rotateMockCamera(){

  rotationIndex =
    (rotationIndex + 1) % cameras.length;

  return cameras[rotationIndex];
}

export function getMockVisionPayload(){

  return {
    type:"vision",
    frameId:`frame-${++frameSequence}`,
    status:"LIVE",
    ts:Date.now(),
    active:cameras[rotationIndex].id,
    heartbeat:"ONLINE",
    cameras:tickMockCameras()
  };
}

console.log("🎥 Mock Camera Runtime READY");
