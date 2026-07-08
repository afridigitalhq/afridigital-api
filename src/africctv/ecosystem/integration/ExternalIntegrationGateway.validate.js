import {
 externalIntegrationGateway
} from "./ExternalIntegrationGateway.js";


const result =
externalIntegrationGateway.connect({
 target:"approved-system"
});


if(result.status!=="APPROVED"){
 throw new Error("INTEGRATION FAILED");
}


console.log("🔗 Target:",result.target);
console.log("✅ Status:",result.status);
console.log("🔒 INTEGRATION GATEWAY LOCKED");
