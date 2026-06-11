import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Broker } from './schemas/broker.schema';
import { Model } from 'mongoose';
import {
  CreateBrokerInput,
  GetBrokerInput,
  UpdateSlugInput,
} from './inputs/broker.input';
import { HelperService } from 'src/common/helper/helper.service';
import { AggregateCommon } from 'src/common/aggregates/aggregate.common';
import { throwHttpException } from 'src/config/filters/http-error.exception.filter';
import { successResponse } from 'src/config/filters/http-success.response';
import { BrokerTypeEnum, ERROR_MESSAGES } from 'src/config/constants';
import { ObjectId } from 'mongodb';

@Injectable()
export class BrokerService {
  constructor(
    @InjectModel(Broker.name)
    private readonly brokerModel: Model<Broker>,
    private readonly helperService: HelperService,
    private readonly aggregateCommon: AggregateCommon,
  ) {}

  async getBrokerType() {
    const result = Object.values(BrokerTypeEnum);
    return successResponse({
      message: `get broker type successfuly`,
      result,
    });
  }

  async getBroker(slug: string) {
    const result = await this.brokerModel.findOne({ slug });
    return successResponse({
      message: `get broker successfuly`,
      result,
    });
  }

  async getBrokers(query: GetBrokerInput) {
    const { limit, skip, type } = query;
    const search = this.helperService.getSearchRegExp(query?.search ?? '');

    const match: any = {
      is_deleted: false,
      ...(type && { broker_type: type }),
      ...(search && {
        $or: [
          { broker_type: search },
          { region: search },
          {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: {
                        $objectToArray: '$name',
                      },
                      as: 'item',
                      cond: {
                        $regexMatch: {
                          input: '$$item.v',
                          regex: query.search,
                          options: 'i',
                        },
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        ],
      }),
    };

    const result = await this.brokerModel.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      ...this.aggregateCommon.pagination({
        skip: Number(skip) || 1,
        limit: Number(limit) || 10,
      }),
      {
        $addFields: {
          status_info: {
            title: this.aggregateCommon.getStatusInfo(),
            value: '$status',
          },
        },
      },
    ]);

    const total = await this.brokerModel.countDocuments(match);
    const total_pages = Math.ceil(total / Number(limit ?? 10));
    const current_page = Number(skip) || 1;

    return successResponse({
      message: `get brokers successfuly`,
      result,
      pagination: {
        current_page,
        total_pages,
        total,
      },
    });
  }

  async createBroker(payload: CreateBrokerInput, userId: string) {
    const { slug } = payload;
    const createBy = new ObjectId(userId);

    const hasSlug = await this.checkExitsSlug(slug);
    if (hasSlug) {
      throwHttpException(ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
    }
    await this.brokerModel.create({
      ...payload,
      performance_metrics: {
        aum_growth: Math.floor(Math.random() * 100),
        liquidity_access: Math.floor(Math.random() * 100),
        client_retention: Math.floor(Math.random() * 100),
      },
      created_by: createBy,
      updated_by: createBy,
    });

    return successResponse({ message: `create broker success` });
  }

  async updateBroker(
    brokerId: string,
    payload: CreateBrokerInput,
    userId: string,
  ) {
    const { slug } = payload;
    const userUpdate = new ObjectId(userId);

    await this.brokerModel
      .findOne({ _id: new ObjectId(brokerId) })
      .orFail(() => throwHttpException(ERROR_MESSAGES.BROKER_NOT_FOUND));

    const hasSlug = await this.checkExitsSlug(slug, brokerId);
    if (hasSlug) {
      throwHttpException(ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
    }

    await this.brokerModel.updateOne(
      { _id: new ObjectId(brokerId) },
      {
        $set: {
          ...payload,
          updated_at: new Date(),
          updated_by: userUpdate,
        },
      },
    );

    return successResponse({ message: `update broker success` });
  }

  async deleteOrRestoreBroker(
    brokerId: string,
    userId: string,
    action: 'delete' | 'restore',
  ) {
    const broker = await this.brokerModel
      .findOne({ _id: new ObjectId(brokerId) })
      .orFail(() => throwHttpException(ERROR_MESSAGES.BROKER_NOT_FOUND));

    const userUpdate = new ObjectId(userId);
    let payload: any = {};

    if (action === 'delete') {
      payload = {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: userUpdate,
      };
    } else {
      payload = {
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
        updated_at: new Date(),
        updated_by: userUpdate,
      };

      const hasSlug = await this.checkExitsSlug(broker.slug, brokerId);
      if (hasSlug) {
        throwHttpException({
          ...ERROR_MESSAGES.SLUG_ALREADY_EXISTS,
          action: 'restore',
        });
      }
    }

    await this.brokerModel.updateOne(
      { _id: new ObjectId(brokerId) },
      {
        $set: payload,
      },
    );

    return successResponse({ message: `${action} broker success` });
  }

  async updateSlug(brokerId: string, payload: UpdateSlugInput, userId: string) {
    const data = {
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      updated_at: new Date(),
      updated_by: new ObjectId(userId),
      slug: payload.slug,
    };

    const hasSlug = await this.checkExitsSlug(payload.slug, brokerId);
    if (hasSlug) {
      throwHttpException({
        ...ERROR_MESSAGES.SLUG_ALREADY_EXISTS,
        action: 'restore',
      });
    }

    await this.brokerModel.updateOne(
      { _id: new ObjectId(brokerId) },
      {
        $set: data,
      },
    );

    return successResponse({ message: `update slug success` });
  }

  async checkExitsSlug(slug: string, brokerId?: string) {
    const broker = await this.brokerModel.findOne({
      slug,
      is_deleted: false,
      ...(brokerId && { _id: { $ne: new ObjectId(brokerId) } }),
    });
    return broker;
  }
}
