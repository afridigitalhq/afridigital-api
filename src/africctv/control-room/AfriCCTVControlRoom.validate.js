import {
 afriCCTVControlRoom
} from "./AfriCCTVControlRoom.js";

afriCCTVControlRoom.register(
 "LIVE_CAMERA"
);

afriCCTVControlRoom.register(
 "RECORDING"
);

const status =
afriCCTVControlRoom.status();

if(!status.active){
 throw new Error("CONTROL ROOM FAILED");
}

console.log("🖥️ Modules:",status.modules.length);
console.log("🚨 Control Room:",status.active);
console.log("🔒 ADMIN CONTROL ROOM LOCKED");
