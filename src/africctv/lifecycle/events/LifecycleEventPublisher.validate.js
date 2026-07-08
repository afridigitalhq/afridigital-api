import { lifecycleEventPublisher } from "./LifecycleEventPublisher.js";

const event =
 lifecycleEventPublisher.publish({
  type:"TEST_EVENT",
  deviceId:"camera-test-event-001",
  payload:{
   status:"READY"
  }
 });


if(!event || event.type !== "TEST_EVENT"){

 throw new Error("LifecycleEventPublisher failed");

}


const list =
 lifecycleEventPublisher.list();


if(!Array.isArray(list) || list.length === 0){

 throw new Error("LifecycleEventPublisher storage failed");

}


console.log("🟢 LifecycleEventPublisher: OK");
