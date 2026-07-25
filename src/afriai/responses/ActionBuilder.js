import CardActionResolver from "./CardActionResolver.js";

export function ActionBuilder(cards = []){

  return cards
    .map(card => CardActionResolver(card))
    .filter(action => action.handled)
    .map(action => ({
      type: action.type,
      target: action.target
    }));

}

export default ActionBuilder;
