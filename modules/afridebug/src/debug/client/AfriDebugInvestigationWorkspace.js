const workspaces=new Map();

const Workspace={

create(data){

const workspace={
workspaceId:"WORKSPACE-"+Date.now(),
caseId:data.caseId,
leadInvestigator:data.leadInvestigator,
status:"active",
evidence:[],
timeline:[],
notes:[],
findings:[],
createdAt:Date.now(),
createdAtISO:new Date().toISOString()
};

workspaces.set(workspace.workspaceId,workspace);
return workspace;

},

addEvidence(workspaceId,evidence){
const ws=workspaces.get(workspaceId);
if(!ws) return null;
ws.evidence.push(evidence);
return ws;
},

addFinding(workspaceId,finding){
const ws=workspaces.get(workspaceId);
if(!ws) return null;
ws.findings.push(finding);
return ws;
},

addNote(workspaceId,note){
const ws=workspaces.get(workspaceId);
if(!ws) return null;
ws.notes.push({
note,
createdAt:Date.now(),
createdAtISO:new Date().toISOString()
});
return ws;
},

health(){
return{
service:"AfriDebugInvestigationWorkspace",
status:"healthy"
};
}

};

export default Workspace;
