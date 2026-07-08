const tickets=[];

export class SupportTicketManager{

 create(ticket){

  tickets.push({
   ...ticket,
   status:"OPEN"
  });

 }

 list(){

  return tickets;

 }

}

export const supportTicketManager =
new SupportTicketManager();
