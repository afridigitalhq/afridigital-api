const AfriAIHandoffManager={
transfer(target="human"){
return{
target,
status:"HANDOFF_READY"
};
}
};

export default AfriAIHandoffManager;
