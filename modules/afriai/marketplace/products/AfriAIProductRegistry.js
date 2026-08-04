const AfriAIProductRegistry={
list(){
return[];
},
register(product={}){
return{
product,
status:"REGISTERED"
};
}
};

export default AfriAIProductRegistry;
