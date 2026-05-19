const bus = {
  services: {
    frontend: "https://afridigital-hub.onrender.com",
    backend: "srv-d7stmedckfvc73cp73i0"
  },

  ai: {
    mode: "autonomous",
    learning_cycle_minutes: 60,
    last_training: null
  },

  economy: {
    wallet: "INTERNAL_CREDIT_SYSTEM",
    currency: "AFRI_COIN",
    ledger: []
  },

  marketplace: {
    jobs: [],
    ads: [],
    offers: []
  },

  state: {
    flow: "init",
    health: "green"
  }
};

module.exports = bus;
