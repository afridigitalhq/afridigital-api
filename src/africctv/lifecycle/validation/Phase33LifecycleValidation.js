import { deviceLifecycleOrchestrator } from "../orchestrator/DeviceLifecycleOrchestrator.js";
import { lifecycleStateEngine } from "../state/LifecycleStateEngine.js";
import { lifecycleGovernanceCoordinator } from "../governance/LifecycleGovernanceCoordinator.js";
import { lifecycleEventPublisher } from "../events/LifecycleEventPublisher.js";


const device = {
 id:"phase33-validation-camera"
};


const lifecycle =
 deviceLifecycleOrchestrator.registerDevice(device);


if(!lifecycle){

 throw new Error("Orchestrator validation failed");

}


const state =
 lifecycleStateEngine.create(device);


if(!state){

 throw new Error("State engine validation failed");

}


const governance =
 lifecycleGovernanceCoordinator.review(device);


if(!governance){

 throw new Error("Governance validation failed");

}


const event =
 lifecycleEventPublisher.deviceRegistered(device);


if(!event){

 throw new Error("Event publisher validation failed");

}


console.log("🟢 Orchestrator: OK");
console.log("🟢 State Engine: OK");
console.log("🟢 Governance: OK");
console.log("🟢 Event Publisher: OK");
console.log("==============================");
console.log("🟢 AFRICCTV DEVICE LIFECYCLE ORCHESTRATION READY");
console.log("🔒 PHASE 33 LOCKED");
