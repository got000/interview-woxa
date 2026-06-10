import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environmentConfig from './environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [environmentConfig],
    }),
  ],
})
export class EnvironmentsModule {}
