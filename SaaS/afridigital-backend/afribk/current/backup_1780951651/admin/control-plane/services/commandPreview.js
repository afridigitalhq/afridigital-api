function previewCommand(command){
  return {
    approved: false,
    dangerous:
      command.includes("rm -rf") ||
      command.includes("mkfs") ||
      command.includes("shutdown"),

    preview: command,

    timestamp: Date.now()
  };
}

module.exports = { previewCommand };
