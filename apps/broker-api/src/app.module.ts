import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { CommonModule } from './common/common.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { GlobalExceptionFilter } from './config/filters/global.exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { IAppEnv, ICacheEnv } from './common/environments/environment.interface';

@Module({
  imports: [
    ModulesModule,
    CommonModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { REDIS_URL, REDIS_PREFIX, REDIS_PASSWORD } =
          configService.getOrThrow<ICacheEnv>('cache');
        const { APP_NODE_ENV } = configService.getOrThrow<IAppEnv>('app');
        const isDevelopment = APP_NODE_ENV === 'development';

        return {
          throttlers: [
            {
              ttl: 60000,
              limit: 60,
              skipIf: () => isDevelopment,
            },
          ],
          errorMessage: 'RATE_LIMIT_EXCEEDED',
          setHeaders: true,
          storage: new ThrottlerStorageRedisService(REDIS_URL, {
            keyPrefix: REDIS_PREFIX,
            password: isDevelopment ? undefined : REDIS_PASSWORD || undefined,
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
