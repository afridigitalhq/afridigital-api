const sessions=new Map();


export class SessionScaler {

 start(id){

  sessions.set(id,{
   id,
   status:"ACTIVE",
   started:Date.now()
  });

  return sessions.get(id);
 }


 count(){
  return sessions.size;
 }

}


export const sessionScaler =
new SessionScaler();
