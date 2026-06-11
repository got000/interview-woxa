import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AggregatesModule } from './aggregates/aggregates.module';
import { CryptorModule } from './cryptor/cryptor.module';
import { EnvironmentsModule } from './environments/environments.module';
import { LoggerModule } from './logger/logger.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    DatabaseModule,
    AggregatesModule,
    CryptorModule,
    EnvironmentsModule,
    LoggerModule,
    HelperModule,
  ],
  exports: [
    DatabaseModule,
    AggregatesModule,
    CryptorModule,
    EnvironmentsModule,
    LoggerModule,
    HelperModule,
  ],
})
export class CommonModule {}
