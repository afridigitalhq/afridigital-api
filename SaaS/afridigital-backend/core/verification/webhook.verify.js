const { assertApiVersion } = require("../runtime/safety/api.guard");
const provider =
require('../providers/whatsapp.provider');

function verify(req, res) {

const mode =
req.query['hub.mode'];

const token =
req.query['hub.verify_token'];

const challenge =
req.query['hub.challenge'];

const verified =
provider.verifyWebhook(
mode,
token
);

if (verified) {

return res.status(200)
.send(challenge);

}

return res.sendStatus(403);
}

module.exports = { verify };
