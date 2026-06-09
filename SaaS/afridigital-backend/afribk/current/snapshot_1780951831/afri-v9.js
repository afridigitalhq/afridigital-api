const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// simulate distributed task
kernel.dispatch({
  traceId: "v9-test-1",
  text: "hello autonomous cluster brain v9"
});
