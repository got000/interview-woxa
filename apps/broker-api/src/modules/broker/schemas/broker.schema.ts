import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CollectionEnum, StatusEnum } from './../../../config/constants';
import { LangSchema, SoftDelete } from './../../../common/database/schemas';

class Contents {
  @Prop({
    type: LangSchema,
    required: true,
  })
  title: LangSchema;

  @Prop({
    type: [{ type: LangSchema }],
    required: true,
  })
  paragraph: LangSchema[];
}

class ContactDetail {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  web_site: string;
}

class PerformanceMetrics {
  @Prop({
    type: Number,
    required: true,
  })
  aum_growth: number;

  @Prop({
    type: Number,
    required: true,
  })
  liquidity_access: number;

  @Prop({
    type: Number,
    required: true,
  })
  client_retention: number;
}

@Schema({ collection: CollectionEnum.BROKER })
export class Broker extends SoftDelete {
  _id?: ObjectId;

  @Prop({
    type: LangSchema,
    required: true,
  })
  name: LangSchema;

  @Prop({
    type: LangSchema,
    required: true,
  })
  desc: LangSchema;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  broker_type: string;

  @Prop({
    type: String,
    required: true,
  })
  logo_url: string;

  @Prop({
    type: String,
    required: true,
  })
  region: string;

  @Prop({
    type: Contents,
    required: true,
  })
  content_detail: Contents;

  @Prop({
    type: ContactDetail,
    required: true,
  })
  contact_detail: ContactDetail;

  @Prop({
    type: PerformanceMetrics,
    required: true,
  })
  performance_metrics: PerformanceMetrics;

  @Prop({
    type: String,
    required: false,
    default: StatusEnum.ACTIVE,
  })
  status: string;
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);
