const CoreCaseGateway={
 send(caseItem){
  return {case:caseItem,status:"ROUTED"};
 }
};

export default CoreCaseGateway;
