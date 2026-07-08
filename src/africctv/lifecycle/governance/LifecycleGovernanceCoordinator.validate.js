import { lifecycleGovernanceCoordinator } from "./LifecycleGovernanceCoordinator.js";

const device = {
 id:"camera-test-governance-001"
};


const review =
 lifecycleGovernanceCoordinator.review(device);


if(!review || review.status !== "REVIEWED"){

 throw new Error("Governance review failed");

}


const approval =
 lifecycleGovernanceCoordinator.approve(device.id);


if(!approval || approval.status !== "APPROVED"){

 throw new Error("Governance approval failed");

}


console.log("🟢 LifecycleGovernanceCoordinator: OK");
