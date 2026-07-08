const controls=new Map();

export class AdminKillSwitch{

 freeze(target){

  controls.set(target,{
   state:"FROZEN",
   reason:"ADMIN_ACTION",
   timestamp:Date.now()
  });

 }


 restore(target){

  controls.set(target,{
   state:"ACTIVE",
   reason:"ADMIN_RESTORE",
   timestamp:Date.now()
  });

 }


 status(target){

  return controls.get(target);

 }

}


export const adminKillSwitch =
new AdminKillSwitch();
