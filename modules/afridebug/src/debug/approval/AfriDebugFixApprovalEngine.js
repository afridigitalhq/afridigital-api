const approvals = [];


const AfriDebugFixApprovalEngine = {


  createProposal(analysis){

    const proposal = {

      proposalId:
        "FIX-" + Date.now(),

      incidentId:
        analysis.incidentId,

      diagnosis:
        analysis.diagnosis,

      proposedFix:
        analysis.recommendation,

      status:
        "pending_approval",

      createdAt:
        Date.now()

    };


    approvals.push(proposal);


    return proposal;

  },


  approve(proposalId){

    const proposal =
      approvals.find(
        item => item.proposalId === proposalId
      );


    if(!proposal)
      return {
        status:"not_found"
      };


    proposal.status =
      "approved";


    return proposal;

  },


  reject(proposalId){

    const proposal =
      approvals.find(
        item => item.proposalId === proposalId
      );


    if(!proposal)
      return {
        status:"not_found"
      };


    proposal.status =
      "cancelled";


    return proposal;

  },


  list(){

    return approvals;

  },


  health(){

    return {

      service:
        "AfriDebugFixApprovalEngine",

      status:
        "healthy"

    };

  }


};


export default AfriDebugFixApprovalEngine;
