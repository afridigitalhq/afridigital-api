module.exports = {
  validate(command, context) {

    if (!command) return false;

    if (command.type === "ADMIN" && context.role !== "admin") {
      return false;
    }

    return true;
  }
};
