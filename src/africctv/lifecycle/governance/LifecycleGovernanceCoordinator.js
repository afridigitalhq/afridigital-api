import { complianceReportingEngine } from "../../governance/compliance/ComplianceReportingEngine.js";

export class LifecycleGovernanceCoordinator {

 constructor(){

  this.records = [];

 }


 review(device){

  const compliance =
   complianceReportingEngine.report();


  const record = {

   deviceId:device.id,

   status:"REVIEWED",

   compliance,

   adminRequired:true,

   timestamp:Date.now()

  };


  this.records.push(record);


  return record;

 }


 approve(deviceId){

  const record = {

   deviceId,

   status:"APPROVED",

   approvedBy:"ADMIN",

   timestamp:Date.now()

  };


  this.records.push(record);


  return record;

 }


 list(){

  return this.records;

 }

}


export const lifecycleGovernanceCoordinator =
 new LifecycleGovernanceCoordinator();
