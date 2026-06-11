import { MongooseModule } from '@nestjs/mongoose';
import { Broker, BrokerSchema } from './broker.schema';

export const BrokerMongooseModule = MongooseModule.forFeature([
  { name: Broker.name, schema: BrokerSchema },
]);
