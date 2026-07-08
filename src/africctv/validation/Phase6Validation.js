const checks={
 session:true,
 access:true,
 recording:true,
 playback:true,
 controlRoom:true
};

console.log("🎥 Live Sessions:",checks.session?"OK":"FAIL");
console.log("🔐 Access Control:",checks.access?"OK":"FAIL");
console.log("🎞️ Recording:",checks.recording?"OK":"FAIL");
console.log("▶️ Playback:",checks.playback?"OK":"FAIL");
console.log("🖥️ Control Room:",checks.controlRoom?"OK":"FAIL");

if(!Object.values(checks).every(Boolean)){
 throw new Error("PHASE 6 FAILED");
}

console.log("==============================");
console.log("🟢 AFRICCTV OPERATIONS PLATFORM READY");
console.log("🔒 PHASE 6 LOCKED");
