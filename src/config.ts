import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['deveopment', 'test', 'production']).default('deveopment'),
  PORT: z.coerce.number().int().positive().default(3000), 
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().positive().default(8000), 
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.issues);
  process.exit(1);
}

export const config = parsed.data;

