const AfriAIPurchaseFlow={
start(product={}){
return{
product,
flow:"PURCHASE",
status:"PREVIEW"
};
}
};

export default AfriAIPurchaseFlow;
