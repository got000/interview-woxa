import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { BrokerMongooseModule } from './schemas';
import { CommonModule } from './../../common/common.module';

@Module({
  imports: [BrokerMongooseModule, CommonModule],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
