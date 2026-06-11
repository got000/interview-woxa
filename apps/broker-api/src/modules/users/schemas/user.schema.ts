import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CollectionEnum, StatusEnum } from './../../../config/constants';
import { SoftDelete } from './../../../common/database/schemas';

@Schema({ collection: CollectionEnum.USERS })
export class Users extends SoftDelete {
  _id?: ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  full_name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: false,
  })
  password: string;

  @Prop({
    type: String,
    required: false,
    default: StatusEnum.ACTIVE,
  })
  status: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
