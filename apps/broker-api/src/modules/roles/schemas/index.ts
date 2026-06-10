import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from './role.schema';

export const RolesMongooseModule = MongooseModule.forFeature([
  { name: Roles.name, schema: RolesSchema },
]);
