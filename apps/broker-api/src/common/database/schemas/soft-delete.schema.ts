import { CollectionEnum } from '../../../config/constants/enum.constant';
import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { BaseSchema } from './base.schema';

export class SoftDelete extends BaseSchema {
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  is_deleted: boolean;

  @Prop({
    type: 'ObjectId',
    required: false,
    index: true,
    ref: CollectionEnum.USERS,
  })
  deleted_by: ObjectId;

  @Prop({
    type: Date,
    required: false,
  })
  deleted_at: Date;
}
