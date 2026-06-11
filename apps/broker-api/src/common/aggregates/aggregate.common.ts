import { Injectable } from '@nestjs/common';
import { ILookup, IPagination, ISorting } from './aggregate.interface';
import { SortEnum, StatusEnum } from './../../config/constants';
import * as dayjs from 'dayjs';

@Injectable()
export class AggregateCommon {
  constructor() {}

  lookup(payload: ILookup) {
    const { from, localField, foreignField, as, unwind, pipeline, variable } =
      payload;
    const isPipelineMode = Array.isArray(pipeline) && pipeline.length > 0;
    const command: any = [
      {
        $lookup: {
          from,
          ...(!isPipelineMode && { localField }),
          ...(!isPipelineMode && { foreignField }),
          as,
          ...(pipeline && { pipeline }),
          ...(variable && { let: variable }),
        },
      },
    ];
    if (unwind) {
      command.push({
        $unwind: {
          path: `$${as}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }
    return command;
  }

  private skip(skip: number, limit: number) {
    if (skip <= 1) return 0;
    return (skip - 1) * limit;
  }

  private limit(skip: number, limit: number) {
    if (skip <= 1) return limit;
    return limit;
  }

  pagination(payload: IPagination) {
    const { skip, limit } = payload;

    if (!limit || limit <= 0) {
      return [];
    }

    return [
      { $skip: this.skip(skip, limit) },
      { $limit: this.limit(skip, limit) },
    ];
  }

  sort(input: ISorting): any[] {
    input = input || {};
    const { sortBy = 'updated_at', orderBy = 'desc' } = input;
    const order = orderBy === SortEnum.ASCENDING ? 1 : -1;
    return [{ $sort: { [sortBy]: order } }];
  }

  getStatusInfo() {
    return {
      $switch: {
        branches: [
          {
            case: { $eq: ['$status', StatusEnum.ACTIVE] },
            then: 'ใช้งาน',
          },
          {
            case: { $eq: ['$status', StatusEnum.INACTIVE] },
            then: 'ปิดใช้งาน',
          },
        ],
        default: '',
      },
    };
  }
}
