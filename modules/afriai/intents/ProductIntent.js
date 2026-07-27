import ProductKnowledge from "../knowledge/ProductKnowledge.js";

export function ProductIntent(message = "") {
  const text = message.toLowerCase();

  for (const [name, info] of Object.entries(ProductKnowledge)) {
    if (text.includes(name.toLowerCase())) {
      return {
        handled: true,
        reply: `${name} — ${info.description} Current status: ${info.status}.`
      };
    }
  }

  return { handled: false };
}

export default ProductIntent;
