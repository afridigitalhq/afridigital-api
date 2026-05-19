function formatResponse(result) {
  if (!result?.executed?.length) {
    return "I couldn’t process your request properly.";
  }

  const last = result.executed[result.executed.length - 1];

  // If WhatsApp tool ran
  if (last?.tool === "whatsapp.send" && last?.output) {
    return last.output.message || "Done.";
  }

  return "Request processed successfully ⚙️";
}

module.exports = { formatResponse };
