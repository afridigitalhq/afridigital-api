const { v4: uuid } = require('uuid');

module.exports = {
  create(){
    return {
      traceId: uuid(),
      createdAt: Date.now()
    };
  }
};
