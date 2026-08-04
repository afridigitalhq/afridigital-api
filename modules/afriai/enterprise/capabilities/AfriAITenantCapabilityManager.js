const AfriAITenantCapabilityManager={
get(tenant="default"){
return{
tenant,
capabilities:[
"chat",
"knowledge",
"automation"
]
};
}
};

export default AfriAITenantCapabilityManager;
