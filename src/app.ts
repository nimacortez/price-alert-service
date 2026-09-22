import express from 'express';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '100kb'}));

  // webhook route will mount express.raw() BEFORE this - signature
  // verification needs exact raw bytes, not re-serialized JSON
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', (_req, res) => res.status(200).json({ status: 'ready' }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;


}