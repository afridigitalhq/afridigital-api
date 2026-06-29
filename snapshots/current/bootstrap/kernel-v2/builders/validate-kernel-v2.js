const {createKernel}=require("../../../core/kernel-v2/createKernel");

console.log("🧠 AFRIKERNEL V2 VALIDATION");
console.log("============================");

const kernel=createKernel();

const result=kernel.dispatch({
  type:"KERNEL_V2_TEST",
  payload:{status:"ok"}
});

console.log("Dispatch:",result);

if(!result || result.ok!==true){
  throw new Error("Kernel dispatch validation failed");
}

console.log("============================");
console.log("🟢 AFRIKERNEL V2 VALIDATED");
