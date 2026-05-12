const { assertApiVersion } = require("../runtime/safety/api.guard");
const media =
require('./media.engine');

const workflow =
require('../../workflows/workflow.router');

async function handleMedia(
  sender,
  message,
  messageObj
) {

  if (
    messageObj?.image ||
    messageObj?.document
  ) {

    const saved =
      media.saveMedia(sender, {
        type: messageObj.image
          ? 'image'
          : 'document',
        url:
          messageObj.image?.url ||
          messageObj.document?.url,
        caption: message
      });

    return `
🖼 MEDIA RECEIVED

Type: ${saved.type}
Workflow linked if active.
`;
  }

  return null;
}

module.exports = {
  handleMedia
};
