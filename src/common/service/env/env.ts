import { z } from 'zod'

export const envSchema = z
  .object({
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    DB_SCHEMA: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    PORT: z.string().default('3333'),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    DOCUMENTATION_PREFIX: z.string(),
    SMTP_HOST: z.string(),
    PORT_EMAIL: z.string().transform((val) => parseInt(val, 10)),
    SECURE_EMAIL: z.string().transform((val) => val.toLowerCase() === 'true'),
    USER_EMAIL: z.string(),
    PASS_EMAIL: z.string(),
    REDIS_HOST: z.string().optional().default('127.0.0.1'),
    REDIS_PORT: z.coerce.number().optional().default(6379),
    REDIS_DB: z.coerce.number().optional().default(0),
    REDIS_PASSWORD: z.string().optional().default(''),
    SERVER_URL: z.string(),
    OTP_MINUTE_DURATION: z.coerce.number().min(1).max(10).optional().default(5),
    OTP_LENGTH: z.coerce.number().min(2).max(10).optional().default(6),
    OTP_MAX_ATTEMPTS: z.coerce.number().min(1).max(10).optional().default(3),
    JWT_OTP_SECRET: z.string(),
    REDIS_TLS: z
      .string()
      .transform((val) => val.toLowerCase() === 'true')
      .optional()
      .default(false),
    REDIS_CLUSTER: z
      .string()
      .transform((val) => val.toLowerCase() === 'true')
      .optional()
      .default(false),
  })
  .transform((env) => ({
    ...env,
    SERVER_URL_PREFIX: `${env.SERVER_URL.replace(/\/$/, '')}/${env.DOCUMENTATION_PREFIX.replace(/^\//, '')}`,
  }))

export type Env = z.infer<typeof envSchema>
