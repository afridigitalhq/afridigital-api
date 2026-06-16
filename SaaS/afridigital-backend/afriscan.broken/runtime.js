const evaluate = require('./evaluator');

module.exports = function runtime(){
  const result = evaluate();

  return {
    ...result,
    render: {
      isolated: true,
      scored: false
    }
  };
};
