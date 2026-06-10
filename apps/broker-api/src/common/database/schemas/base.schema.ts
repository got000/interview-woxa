import { CollectionEnum } from '../../../config/constants/enum.constant';
import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

export class BaseSchema {
  @Prop({
    type: 'ObjectId',
    required: false,
    index: true,
    ref: CollectionEnum.USERS,
    default: new ObjectId('68a359d6c562f9922cfc53f9'),
  })
  created_by: ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  created_at: Date;

  @Prop({
    type: 'ObjectId',
    required: false,
    index: true,
    ref: CollectionEnum.USERS,
    default: new ObjectId('68a359d6c562f9922cfc53f9'),
  })
  updated_by: ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  updated_at: Date;
}
