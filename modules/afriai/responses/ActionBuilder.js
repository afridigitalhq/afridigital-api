import CardActionResolver from "./CardActionResolver.js";

export function ActionBuilder(cards = []){

  return cards
    .map(card => ({
      card,
      action: CardActionResolver(card)
    }))
    .filter(({action}) => action.handled)
    .map(({card, action}) => ({
      type: action.type,
      target: action.target,
      route: action.route || "",
      metadata:{
        status: card.status || "",
        availability: card.availability || ""
      }
    }));

}

export default ActionBuilder;
