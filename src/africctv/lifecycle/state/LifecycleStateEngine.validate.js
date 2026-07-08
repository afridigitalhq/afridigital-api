import { lifecycleStateEngine } from "./LifecycleStateEngine.js";

const device = {
 id:"camera-test-state-001"
};


const created =
 lifecycleStateEngine.create(device);


if(!created || created.state !== "REGISTERED"){

 throw new Error("LifecycleStateEngine create failed");

}


const updated =
 lifecycleStateEngine.transition(
  device.id,
  "ACTIVE"
 );


if(!updated || updated.state !== "ACTIVE"){

 throw new Error("LifecycleStateEngine transition failed");

}


console.log("🟢 LifecycleStateEngine: OK");
