import { initAfriVisionStream } from './realtime/afrivision/afriVisionStream.js';

const originalListen = app.listen.bind(app);
app.listen = (PORT, cb) => {
  const server = originalListen(PORT, cb);
  initAfriVisionStream(server);
  return server;
};
