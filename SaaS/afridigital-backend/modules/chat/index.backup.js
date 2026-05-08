async function handleIncomingMessage({ message, channel, from }) {
  console.log("Incoming message:", {
    channel,
    from,
    message
  });

  return "AI response received: " + message;
}

module.exports = {
  handleIncomingMessage
};
