export function UnknownIntent() {
  return {
    handled: true,
    fallback: true,
    reply:
      "I can help you explore AfriDigital products, services, and capabilities. For this request, I will connect you with our support team for further assistance."
  };
}

export default UnknownIntent;
