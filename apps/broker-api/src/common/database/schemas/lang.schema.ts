import { Prop } from '@nestjs/mongoose';

export class LangSchema {
  @Prop({
    type: String,
    required: true,
  })
  th: string;

  @Prop({
    type: String,
    required: false,
  })
  en: string;
}
