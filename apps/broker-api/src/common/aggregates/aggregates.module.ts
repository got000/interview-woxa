import { Module } from '@nestjs/common';
import { AggregateCommon } from './aggregate.common';
import { AggregateLookup } from './aggregate.lookup';

@Module({
  exports: [AggregateCommon, AggregateLookup],
  providers: [AggregateCommon, AggregateLookup],
})
export class AggregatesModule {}
