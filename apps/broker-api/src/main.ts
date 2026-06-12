import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { IAppEnv } from './common/environments/environment.interface';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors/cors.config';
import helmet from 'helmet';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ERROR_MESSAGES } from './config/constants';
import { throwHttpException } from './config/filters/http-error.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const { APP_PORT, APP_PREFIX } = configService.getOrThrow<IAppEnv>('app');
  app.set('trust proxy', 1);

  app.use(cookieParser());
  app.enableCors(corsConfig(configService));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.setGlobalPrefix(APP_PREFIX);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Broker Management')
    .setDescription('API documentation by Chaiwat')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Service')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .join(', ');

        return throwHttpException({
          ...ERROR_MESSAGES.VALIDATION_ERROR,
          message: message || ERROR_MESSAGES.VALIDATION_ERROR.message,
        });
      },
    }),
  );

  await app.listen(APP_PORT, () =>
    Logger.log(
      `Running Service on URL http://localhost:${APP_PORT}/${APP_PREFIX}`,
      'Bootstrap',
    ),
  );
}
bootstrap();
