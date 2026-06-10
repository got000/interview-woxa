import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AggregatesModule } from './aggregates/aggregates.module';
import { CryptorModule } from './cryptor/cryptor.module';
import { EnvironmentsModule } from './environments/environments.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    AggregatesModule,
    CryptorModule,
    EnvironmentsModule,
    LoggerModule,
  ],
  exports: [
    DatabaseModule,
    AggregatesModule,
    CryptorModule,
    EnvironmentsModule,
    LoggerModule,
  ],
})
export class CommonModule {}
