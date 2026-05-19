const v7 = require("./v7.build-layer.cjs");
const v8 = require("./v8.observability.cjs");

console.log("\n🚀 AFRIDIGITAL CONTROL PLANE BOOT\n");

v7.run();
v8.run();

console.log("\n✅ SYSTEM READY FOR V9 INTELLIGENCE LAYER\n");
