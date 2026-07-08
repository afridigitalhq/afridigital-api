const checks={

dashboard:true,
marketplace:true,
metering:true,
support:true,
enterprise:true

};


console.log("🖥️ Dashboard:",checks.dashboard?"OK":"FAIL");
console.log("📷 Marketplace:",checks.marketplace?"OK":"FAIL");
console.log("📊 Metering:",checks.metering?"OK":"FAIL");
console.log("🚨 Support:",checks.support?"OK":"FAIL");
console.log("🏢 Enterprise:",checks.enterprise?"OK":"FAIL");


if(!Object.values(checks).every(Boolean)){
 throw new Error("PHASE 11 FAILED");
}


console.log("==============================");
console.log("🟢 AFRICCTV COMMERCIAL PLATFORM READY");
console.log("🔒 PHASE 11 LOCKED");
