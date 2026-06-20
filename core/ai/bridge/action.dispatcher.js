const bus = require('../../../realtime/event.stream');

async function dispatch(intent, payload = {}) {

  const map = {
    jobs: "JOB_REQUEST",
    services: "SERVICE_REQUEST",
    earn: "EARN_REQUEST",
    boost: "BOOST_REQUEST",
    social: "SOCIAL_REQUEST",
    wallet: "WALLET_REQUEST"
  };

  const event = map[intent];

  if (!event) {
    return {
      ok: false,
      error: "UNKNOWN_INTENT",
      intent
    };
  }

  bus.emit(event, {
    intent,
    payload,
    timestamp: Date.now()
  });

  return {
    ok: true,
    intent,
    event
  };
}

module.exports = { dispatch };



