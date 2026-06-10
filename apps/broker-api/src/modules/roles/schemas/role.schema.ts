import { CollectionEnum, StatusEnum } from './../../../config/constants';
import { SoftDelete } from './../../../common/database/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({ collection: CollectionEnum.ROLES, timestamps: true })
export class Roles extends SoftDelete {
  _id?: ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, default: StatusEnum.ACTIVE, type: String })
  status: string;
}

const RolesSchema = SchemaFactory.createForClass(Roles);
export { RolesSchema };
