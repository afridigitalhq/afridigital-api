export function processVoiceCommand(text) {
  const command = text.toLowerCase();

  if (command.includes("system status")) {
    return { intent: "STATUS_QUERY", response: "System stable across core modules." };
  }

  if (command.includes("risk")) {
    return { intent: "RISK_QUERY", response: "Predictive risk layer is monitoring anomalies." };
  }

  if (command.includes("show payment")) {
    return { intent: "OBS_NAV", target: "PAYMENT_OBS" };
  }

  if (command.includes("show ai")) {
    return { intent: "OBS_NAV", target: "AFRIAI_OBS" };
  }

  return {
    intent: "UNKNOWN",
    response: "Command not recognized in simulation mode."
  };
}
