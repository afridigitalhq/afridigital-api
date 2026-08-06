import fs from "fs";

export function requestApproval(){

  console.log("\n🔐 AfriDebug Human Approval Gate");

  const result = {
    component:"Human Approval Gate",
    status:"PENDING_APPROVAL",
    approved:false,
    reviewerRequired:true,
    timestamp:new Date().toISOString()
  };

  fs.mkdirSync(
    "modules/afridebug/evidence",
    {recursive:true}
  );

  fs.writeFileSync(
    "modules/afridebug/evidence/approval-gate.json",
    JSON.stringify(result,null,2)
  );

  console.log("✅ Approval gate created");

  return true;
}
