import express from 'express';
import { initAfriVisionStream } from './realtime/afrivision/afriVisionStream.js';

const app = express();
const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log('🚀 AfriDigital running on port', PORT);
  initAfriVisionStream(server);
});
