const AfriAITenantIsolation={
scope(tenant="default"){
return{
tenant,
isolated:true
};
}
};

export default AfriAITenantIsolation;
