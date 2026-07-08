import { WebSocketServer } from "ws";

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
      const payload={
        type:"vision",
        status:"LIVE",
        ts:Date.now(),
        cameras:[
          {id:1,name:"Camera 1",motion:Math.random()},
          {id:2,name:"Camera 2",motion:Math.random()},
          {id:3,name:"Camera 3",motion:Math.random()}
        ]
      };

      const msg=JSON.stringify(payload);

      this.clients.forEach(c=>{
        if(c.readyState===1) c.send(msg);
      });
    },1000);

    console.log("🎥 AfriCCTV WebSocket LIVE → /ws/africctv");
    return this;
  }
}
