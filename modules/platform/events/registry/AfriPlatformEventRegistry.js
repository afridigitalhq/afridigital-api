const EVENTS = [
  "TRADE_OPENED",
  "TRADE_CLOSED",
  "TRADE_ENTRY_HIT",
  "TRADE_STOP_LOSS_HIT",
  "TRADE_TAKE_PROFIT_HIT",
  "TRADE_OPPORTUNITY",
  "MARKET_UPDATE",
  "TRADE_SIGNAL",
  "TRADE_ALERT",
  "HORIZON_ALERT",
  "AFRIFOREX_INTELLIGENCE_UPDATE",
  "DAILY_TRADING_SUMMARY"
];

const AfriPlatformEventRegistry = {
  list() {
    return [...EVENTS];
  },

  has(event) {
    return EVENTS.includes(event);
  }
};

export default AfriPlatformEventRegistry;
