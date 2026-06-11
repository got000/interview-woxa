export interface IEnvConfig {
  app: IAppEnv;
  jwt: IJwtEnv;
  mongodb: IMongoEnv;
  cache: ICacheEnv;
}

export interface IAppEnv {
  APP_PORT: number;
  APP_PREFIX: string;
  APP_FRONTEND_URL: string;
  APP_NODE_ENV: string;
}

export interface IJwtEnv {
  JWT_EXPIRATION: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export interface IMongoEnv {
  MONGO_URL: string;
}

export interface ICacheEnv {
  REDIS_URL: string;
  REDIS_PREFIX: string;
  REDIS_PASSWORD: string;
}
