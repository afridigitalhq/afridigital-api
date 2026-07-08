import {
 evidenceStore
} from "./EvidenceStore.js";


const item =
evidenceStore.save({
 cameraId:"cam01",
 type:"MOTION_EVENT",
 timeline:"ACTIVE"
});


const records =
evidenceStore.list();


if(
 !item ||
 records.length!==1
){
 throw new Error("EVIDENCE STORAGE FAILED");
}


console.log("🗂️ Evidence:",item.id);
console.log("🎥 Camera:",item.cameraId);
console.log("📌 Type:",item.type);
console.log("🔒 EVIDENCE STORAGE LOCKED");
