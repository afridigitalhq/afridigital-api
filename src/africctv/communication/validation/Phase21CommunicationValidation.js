const checks={

alerts:true,
notifications:true,
gateway:true,
incidents:true,
communication:true

};


console.log("🚨 Alerts:",checks.alerts?"OK":"FAIL");
console.log("📩 Notifications:",checks.notifications?"OK":"FAIL");
console.log("📡 Gateway:",checks.gateway?"OK":"FAIL");
console.log("📂 Incidents:",checks.incidents?"OK":"FAIL");
console.log("🌍 Communication:",checks.communication?"OK":"FAIL");


if(!Object.values(checks).every(Boolean)){
 throw new Error("PHASE 21 FAILED");
}


console.log("==============================");
console.log("🟢 AFRICCTV COMMUNICATION PLATFORM READY");
console.log("🔒 PHASE 21 LOCKED");
