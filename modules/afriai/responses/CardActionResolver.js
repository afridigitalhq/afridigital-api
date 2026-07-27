export function CardActionResolver(card = {}){

  if(!card.action){
    return {
      handled:false
    };
  }

  switch(card.action){

    case "preview_product":
      return {
        handled:true,
        type:"preview",
        target:card.id,
        route:card.route
      };


    case "request_access":
      return {
        handled:true,
        type:"access_request",
        target:card.id
      };


    case "notify_launch":
      return {
        handled:true,
        type:"launch_notification",
        target:card.id
      };


    default:
      return {
        handled:false
      };

  }

}

export default CardActionResolver;
