import * as Joi from 'joi';

const configSchema = Joi.object({
  LOG_LEVEL: Joi.string()
    .allow('trace', 'debug', 'info', 'warn', 'error', 'fatal')
    .optional()
    .default('info'),
  LOG_MIN_BUFFER: Joi.number().min(0).optional().default(4096),
  LOG_ASYNC: Joi.string().optional(),
  PORT: Joi.number().optional().default(3000),
  PG_DATABASE_WRITE_URL: Joi.string().required(),
  PG_DATABASE_READ_URL: Joi.string().required(),
  // add more configuration schema below
  JWT_SECRET: Joi.string().base64().required(),
  OPENSEARCH_NODE: Joi.string().required(),
  OPENSEARCH_CREDENTIAL: Joi.string()
    .regex(/^.+:.+$/) //{username}:password
    .optional(),
  EXTERNAL_API_TIMEOUT: Joi.string().optional().default(5000),
  LEGACY_API_URL: Joi.string().required(),
});

export { configSchema };
