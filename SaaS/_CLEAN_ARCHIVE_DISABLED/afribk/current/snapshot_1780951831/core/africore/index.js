const dispatcher = require('./runtime/dispatcher');

module.exports = {
  async handleEvent(event) {
    return dispatcher.dispatch(event);
  }
};
