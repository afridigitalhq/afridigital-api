import {
 operationsWebSocketHub
} from "./OperationsWebSocketHub.js";


operationsWebSocketHub.connect("admin");


const result =
operationsWebSocketHub.broadcast(
"camera_status_update"
);


if(result.delivered!==1){
 throw new Error("WEBSOCKET HUB FAILED");
}


console.log("📡 Event:",result.event);
console.log("👥 Clients:",result.delivered);
console.log("🔒 OPERATIONS WEBSOCKET HUB LOCKED");
