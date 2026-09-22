import type { ErrorRequestHandler, RequestHandler } from 'express'; 
import { ZodError } from 'zod';
import { AppError } from '../errors';
import { logger } from '../logger';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND'));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err); 

  if (err instanceof ZodError) {
    return res.status(400).json({error: 'VALIDATION_ERROR', issues: err.issues });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.code, message: err.message });
  }

  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error occurred');
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
}