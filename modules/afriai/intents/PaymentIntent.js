import PaymentsKnowledge from "../knowledge/PaymentsKnowledge.js";

export function PaymentIntent(message = "") {
  const text = message.toLowerCase();

  if (
    text.includes("payment") ||
    text.includes("pay") ||
    text.includes("wallet") ||
    text.includes("africoin") ||
    text.includes("bank") ||
    text.includes("card")
  ) {
    return {
      handled: true,
      reply: `${PaymentsKnowledge.response.unavailable} ${PaymentsKnowledge.response.future}`
    };
  }

  return { handled: false };
}

export default PaymentIntent;
