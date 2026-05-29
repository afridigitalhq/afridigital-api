const brain = require('../ai/brain');

module.exports = {
  async process(event){
    return brain.runBrain(event);
  }
};
