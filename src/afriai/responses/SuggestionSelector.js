import SuggestionRegistry from "./SuggestionRegistry.js";

export function SuggestionSelector(message = ""){

  const text = message.toLowerCase();

  const find = (...ids) =>
    SuggestionRegistry.products.filter(
      item => ids.includes(item.id)
    );

  if(
    text.includes("design") ||
    text.includes("studio") ||
    text.includes("afriui") ||
    text.includes("africode") ||
    text.includes("afriapp")
  ){
    return find(
      "AfriDesign Studio",
      "AfriCommerce"
    );
  }


  if(
    text.includes("shop") ||
    text.includes("commerce") ||
    text.includes("sell") ||
    text.includes("buy")
  ){
    return find(
      "AfriCommerce",
      "AfriBoost"
    );
  }


  if(
    text.includes("advert") ||
    text.includes("business") ||
    text.includes("promotion") ||
    text.includes("market")
  ){
    return find(
      "AfriBoost",
      "AfriCommerce"
    );
  }


  if(
    text.includes("security") ||
    text.includes("camera") ||
    text.includes("cctv")
  ){
    return find(
      "AfriCCTV",
      "AfriTracker"
    );
  }


  return find(
    "AfriCommerce",
    "AfriDesign Studio",
    "AfriCCTV",
    "AfriBoost",
    "AfriWork"
  );

}

export default SuggestionSelector;
