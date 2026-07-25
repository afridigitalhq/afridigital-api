import AfriPlatformKnowledge from "../knowledge/AfriPlatformKnowledge.js";

export function GreetingIntent(message = "") {
  const text = message.toLowerCase().trim();

  const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening"
  ];

  if (!greetings.some(greeting => text.includes(greeting))) {
    return { handled: false };
  }

  return {
    handled: true,
    reply: `Hello! 👋 Welcome to ${AfriPlatformKnowledge.platform.name}. I'm AfriAI, your intelligent assistant for the AfriDigital ecosystem. I can help you explore our products, explain features, provide development status updates, and answer questions about the platform.`
  };
}

export default GreetingIntent;
