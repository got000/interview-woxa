import { Injectable } from '@nestjs/common';
import { ILookupInput } from './aggregate.interface';
import { AggregateCommon } from './aggregate.common';
import { CollectionEnum } from './../../config/constants';

@Injectable()
export class AggregateLookup {
  constructor(private readonly aggregate: AggregateCommon) {}

  lookupUser(input: ILookupInput) {
    const { localField = 'user_id', foreignField = '_id' } = input;
    const { as = 'user_info', unwind = false } = input;
    const { variable, pipeline } = input;

    return this.aggregate.lookup({
      from: CollectionEnum.USERS,
      localField,
      foreignField,
      as,
      unwind,
      pipeline,
      variable,
    });
  }
}
