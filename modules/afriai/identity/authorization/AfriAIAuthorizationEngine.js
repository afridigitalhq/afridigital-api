const AfriAIAuthorizationEngine={
check(role="public",action="read"){
return{
role,
action,
allowed:true
};
}
};

export default AfriAIAuthorizationEngine;
