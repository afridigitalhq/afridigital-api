const AfriAIDecisionPolicy={
evaluate(intent="general"){
return{
intent,
mode:"PREVIEW",
allowed:true
};
}
};

export default AfriAIDecisionPolicy;
