const { assertApiVersion } = require("../runtime/safety/api.guard");
function adaptResponse(response, channel) {

  if (channel === 'whatsapp') {
    return {
      type: 'text',
      body: response
    };
  }

  if (channel === 'web') {
    return {
      success: true,
      data: response
    };
  }

  if (channel === 'dashboard') {
    return {
      widget: response
    };
  }

  return response;
}

module.exports = {
  adaptResponse
};
