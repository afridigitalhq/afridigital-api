const AfriAIMarketplaceOrders={
create(order={}){
return{
order,
status:"CREATED"
};
},
list(){
return[];
}
};

export default AfriAIMarketplaceOrders;
