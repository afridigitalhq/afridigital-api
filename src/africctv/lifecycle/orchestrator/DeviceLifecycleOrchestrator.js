import { cameraOnboarding } from "../../enterprise/onboarding/CameraOnboarding.js";
import { cameraIdentityManager } from "../../identity/device/CameraIdentityManager.js";
import { cameraConfigurationManager } from "../../configuration/CameraConfigurationManager.js";
import { capabilityDiscoveryEngine } from "../../sdk/capabilities/CapabilityDiscoveryEngine.js";
import { cameraDeploymentRegistry } from "../../deployment/registry/CameraDeploymentRegistry.js";
import { deviceStateSynchronizer } from "../../state/DeviceStateSynchronizer.js";
import { complianceReportingEngine } from "../../governance/compliance/ComplianceReportingEngine.js";

export class DeviceLifecycleOrchestrator {

 constructor(){

  this.lifecycle = new Map();

 }

 registerDevice(device){

  const identity =
   cameraIdentityManager.register(device);

  cameraDeploymentRegistry.register(device);

  deviceStateSynchronizer.update({
   id:device.id,
   state:"REGISTERED"
  });

  this.lifecycle.set(device.id,{
   id:device.id,
   stage:"REGISTERED",
   createdAt:Date.now()
  });

  return {
   device:identity,
   lifecycle:this.lifecycle.get(device.id)
  };

 }


 onboard(customer){

  return cameraOnboarding.onboard(customer);

 }


 configure(deviceId,config){

  cameraConfigurationManager.save(
   deviceId,
   config
  );

  this.updateStage(
   deviceId,
   "CONFIGURED"
  );

  return this.lifecycle.get(deviceId);

 }


 discover(plugin){

  return capabilityDiscoveryEngine.inspect(plugin);

 }


 deploy(device){

  cameraDeploymentRegistry.register(device);

  this.updateStage(
   device.id,
   "DEPLOYED"
  );

  return this.lifecycle.get(device.id);

 }


 compliance(){

  return complianceReportingEngine.report();

 }


 updateStage(id,stage){

  const current =
   this.lifecycle.get(id) || {};

  this.lifecycle.set(id,{
   ...current,
   id,
   stage,
   updatedAt:Date.now()
  });

 }


 get(id){

  return this.lifecycle.get(id);

 }


 list(){

  return [...this.lifecycle.values()];

 }

}


export const deviceLifecycleOrchestrator =
 new DeviceLifecycleOrchestrator();
