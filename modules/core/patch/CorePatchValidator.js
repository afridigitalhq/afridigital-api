const CorePatchValidator={
 validate(result){
  return {
   result,
   valid:true,
   status:"VALIDATED"
  };
 }
};

export default CorePatchValidator;
