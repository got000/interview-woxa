import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './user.schema';

export const UsersMongooseModule = MongooseModule.forFeature([
  { name: Users.name, schema: UsersSchema },
]);
