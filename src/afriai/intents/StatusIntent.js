import StatusKnowledge from "../knowledge/StatusKnowledge.js";

export function StatusIntent(message = "") {
  const text = message.toLowerCase();

  for (const [name, status] of Object.entries(StatusKnowledge.products)) {
    if (text.includes(name.toLowerCase())) {
      return {
        handled: true,
        reply: `${name} is currently ${status}. New capabilities are being released progressively as development continues.`
      };
    }
  }

  if (text.includes("payment") || text.includes("pay") || text.includes("africoin")) {
    return {
      handled: true,
      reply: `Payments are currently ${StatusKnowledge.services.Payments}. AfriCoin is ${StatusKnowledge.services.AfriCoin}. Payment services will become available in a future release.`
    };
  }

  return { handled: false };
}

export default StatusIntent;
