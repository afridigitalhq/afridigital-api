export const PaymentsKnowledge = {
  status: "Under Development",

  current: {
    paymentsEnabled: false,
    afriCoinEnabled: false,
    cardPayments: false,
    bankTransfers: false,
    wallet: false,
    subscriptions: false
  },

  planned: {
    afriCoin: "Planned",
    digitalWallet: "Planned",
    cardPayments: "Future",
    bankTransfers: "Future",
    merchantPayments: "Future",
    subscriptions: "Future",
    paymentGateway: "Future"
  },

  response: {
    unavailable:
      "Payments are currently under development across the AfriDigital ecosystem. Payment processing is not yet available.",
    future:
      "When launched, AfriDigital will support AfriCoin together with additional payment methods as they become available."
  }
};

export default PaymentsKnowledge;
