import GreetingIntent from "../intents/GreetingIntent.js";
import HelpIntent from "../intents/HelpIntent.js";
import PaymentIntent from "../intents/PaymentIntent.js";
import StudioIntent from "../intents/StudioIntent.js";
import ProductIntent from "../intents/ProductIntent.js";
import StatusIntent from "../intents/StatusIntent.js";
import UnknownIntent from "../intents/UnknownIntent.js";

const intents = [
  GreetingIntent,
  HelpIntent,
  PaymentIntent,
  StudioIntent,
  ProductIntent,
  StatusIntent
];

export function IntentRouter(message = "") {
  for (const intent of intents) {
    const result = intent(message);

    if (result?.handled) {
      return result;
    }
  }

  return UnknownIntent(message);
}

export default IntentRouter;
