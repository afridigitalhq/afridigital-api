import {
 evidenceExportGateway
} from "./EvidenceExportGateway.js";


const result =
evidenceExportGateway.export({
 owner:"user001",
 format:"MP4"
});


if(result.status!=="AUTHORIZED_EXPORT"){
 throw new Error("EXPORT FAILED");
}


console.log("📥 Format:",result.format);
console.log("👤 Owner:",result.owner);
console.log("🔒 EVIDENCE EXPORT GATEWAY LOCKED");
