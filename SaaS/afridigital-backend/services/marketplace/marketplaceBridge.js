const router = require('./opportunityRouter');

class MarketplaceBridge {

  async handle({ message }) {

    const intent = router.detectIntent(message);

    return {
      detectedIntent: intent,
      marketplace: true
    };
  }

}

module.exports = new MarketplaceBridge();
