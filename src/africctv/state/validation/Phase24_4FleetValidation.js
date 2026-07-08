import {
 deviceStateSynchronizer
} from "../DeviceStateSynchronizer.js";

import {
 fleetPresenceEngine
} from "../FleetPresenceEngine.js";

import {
 fleetMetricsCollector
} from "../FleetMetricsCollector.js";

import {
 adminResponseAssistant
} from "../../intelligence/response/AdminResponseAssistant.js";


const cameras=[

 {
  id:"cam01",
  session:"ACTIVE",
  reachable:true
 },

 {
  id:"cam02",
  reachable:false
 },

 {
  id:"cam03",
  cause:"SERVICE_LIMITED"
 }

];


const states=cameras.map(camera=>{

 const state=
 fleetPresenceEngine.classify(camera);

 deviceStateSynchronizer.update({
  ...camera,
  state
 });

 return {
  ...camera,
  state
 };

});


const metrics=
fleetMetricsCollector.collect(states);


const recommendation=
adminResponseAssistant.analyze(states[2]);


if(
metrics.online!==1 ||
metrics.offline!==1 ||
metrics.idle!==1
){

 throw new Error("FLEET CLASSIFICATION FAILED");

}


console.log("🎥 Total Users:",metrics.totalUsers);
console.log("🟢 Online:",metrics.online);
console.log("🟡 Offline:",metrics.offline);
console.log("⚪ Idle:",metrics.idle);
console.log("🧠 AfriAI Observation:",recommendation.recommendation);
console.log("👤 Admin Control Required");
console.log("🔒 FLEET PRESENCE INTELLIGENCE LOCKED");
