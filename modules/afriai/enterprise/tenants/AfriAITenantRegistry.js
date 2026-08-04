const AfriAITenantRegistry={
load(){
return["default"];
},
register(tenant="default"){
return{
tenant,
status:"REGISTERED"
};
}
};

export default AfriAITenantRegistry;
