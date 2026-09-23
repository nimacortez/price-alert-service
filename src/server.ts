import http from 'node:http';
import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

const app = createApp();
const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server is listening on port ${config.PORT}`);
});

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return; 
  shuttingDown = true;
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  const forceExit = setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, config.SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  try {
    // Later order: feed -> WS clients -> HTTP -> SQS drain -> pg/redis
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    logger.info('HTTP server closed');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
    process.exit(1);
  }


}