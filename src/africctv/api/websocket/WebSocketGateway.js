import { WebSocketServer } from "ws";
import { getMockVisionPayload } from "../../runtime/MockCameraRuntime.js";
import { observeCameraFeed } from "../../intelligence/AfriCCTVObservationEngine.js";
import { rotateCameraWall } from "../../runtime/wall/CameraWallRuntime.js";

export class WebSocketGateway {
  constructor(server){
    this.server=server;
    this.clients=new Set();
  }

  start(){
    this.wss=new WebSocketServer({server:this.server,path:"/ws/africctv"});

    this.wss.on("connection",ws=>{
      this.clients.add(ws);

      ws.send(JSON.stringify({
        type:"system",
        status:"connected",
        service:"AfriCCTV",
        ts:Date.now()
      }));

      ws.on("close",()=>this.clients.delete(ws));
    });

    setInterval(()=>{
      const payload=getMockVisionPayload();

      const aiObservation = observeCameraFeed(payload);
      const wall = rotateCameraWall();

      const msg=JSON.stringify({
        ...payload,
        aiObservation,
        wall
      });

      this.clients.forEach(c=>{
        if(c.readyState===1) c.send(msg);
      });
    },1000);

    console.log("🎥 AfriCCTV WebSocket LIVE → /ws/africctv");
    return this;
  }
}
