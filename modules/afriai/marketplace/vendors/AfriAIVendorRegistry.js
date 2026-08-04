const AfriAIVendorRegistry={
list(){
return[];
},
register(vendor={}){
return{
vendor,
status:"REGISTERED"
};
}
};

export default AfriAIVendorRegistry;
