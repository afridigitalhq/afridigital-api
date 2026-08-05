const AfriDebugPatchAdvisor={
  suggest(issue){
    return {issue,status:"PATCH_PROPOSAL_READY"};
  }
};

export default AfriDebugPatchAdvisor;
