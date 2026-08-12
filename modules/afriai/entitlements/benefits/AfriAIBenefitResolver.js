const AfriAIBenefitResolver={
  resolve({product=null,capability=null,plan="free"}={}){
    return {product,capability,plan,benefits:[]};
  }
};
export default AfriAIBenefitResolver;
