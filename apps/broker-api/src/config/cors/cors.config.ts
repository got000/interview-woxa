import { IAppEnv } from './../../common/environments/environment.interface';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const corsConfig = (configService: ConfigService): CorsOptions => {
  const configUrl = configService.getOrThrow<IAppEnv>('app');
  const { APP_FRONTEND_URL } = configUrl;

  const isProduction = process.env.APP_NODE_ENV === 'production';

  let origin: string | string[];

  if (!isProduction) {
    origin = '*';
  } else if (configUrl) {
    origin = [APP_FRONTEND_URL];
  } else {
    origin = '*';
  }

  return {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin,
    exposedHeaders: ['Content-Disposition'],
  };
};
