const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function saveMedia(phone, media) {

  const store =
    db.read('media.db.json');

  const entry = {
    phone,
    type: media.type,
    url: media.url || null,
    caption: media.caption || '',
    workflow: media.workflow || null,
    timestamp: Date.now()
  };

  store.push(entry);

  db.write('media.db.json', store);

  return entry;
}

function getUserMedia(phone) {

  const store =
    db.read('media.db.json');

  return store.filter(
    m => m.phone === phone
  );
}

module.exports = {
  saveMedia,
  getUserMedia
};
