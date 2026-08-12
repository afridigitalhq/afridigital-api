import fs from "fs";

const file="modules/core/.data/afri-approval-records.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriApprovalEngine={

 submit(request={}){

  const approvals=load();

  const record={
   approvalId:"approval_"+Date.now(),
   previewId:request.previewId || null,
   userId:request.userId || null,
   product:request.product || "AfriBuild",
   approvalType:request.approvalType || "WORKSHOP_REVIEW",
   reviewer:request.reviewer || "OWNER",
   status:"PENDING_APPROVAL",
   createdAt:new Date().toISOString()
  };

  approvals.push(record);
  save(approvals);

  return record;

 },

 approve(approvalId){

  const approvals=load();

  const item=approvals.find(
   x=>x.approvalId===approvalId
  );

  if(!item){
   return {
    status:"APPROVAL_NOT_FOUND"
   };
  }

  item.status="APPROVED";
  item.approvedAt=new Date().toISOString();

  save(approvals);

  return item;

 },

 list(){
  return load();
 }

};

export default AfriApprovalEngine;
