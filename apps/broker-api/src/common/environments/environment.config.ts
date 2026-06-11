import { IEnvConfig } from './environment.interface';

const ENV = process.env;

export default (): IEnvConfig => ({
  app: {
    APP_PORT: parseInt(ENV.APP_PORT ?? '3001', 10),
    APP_PREFIX: ENV.APP_PREFIX ?? '',
    APP_FRONTEND_URL: ENV.APP_FRONTEND_URL ?? '',
  },
  jwt: {
    JWT_EXPIRATION: ENV.JWT_EXPIRATION ?? '',
    JWT_SECRET: ENV.JWT_SECRET ?? '',
    JWT_EXPIRES_IN: ENV.JWT_EXPIRES_IN ?? '',
  },
  mongodb: {
    MONGO_URL: ENV.MONGO_URL ?? '',
  },
});
