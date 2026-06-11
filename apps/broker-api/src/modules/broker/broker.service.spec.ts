import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BrokerService } from './broker.service';
import { Broker } from './schemas/broker.schema';
import { HelperService } from 'src/common/helper/helper.service';
import { AggregateCommon } from 'src/common/aggregates/aggregate.common';
import { BrokerTypeEnum, StatusEnum } from 'src/config/constants';

const USER_ID = '507f1f77bcf86cd799439011';
const BROKER_ID = '507f1f77bcf86cd799439012';

function createFindOneResult(doc: unknown) {
  return {
    orFail: jest.fn((onError: () => never) =>
      doc ? Promise.resolve(doc) : Promise.resolve(onError()),
    ),
    then: (resolve: (value: unknown) => unknown) => resolve(doc),
  };
}

describe('BrokerService', () => {
  let service: BrokerService;
  let brokerModel: {
    findOne: jest.Mock;
    aggregate: jest.Mock;
    countDocuments: jest.Mock;
    create: jest.Mock;
    updateOne: jest.Mock;
  };

  beforeEach(async () => {
    brokerModel = {
      findOne: jest.fn(),
      aggregate: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrokerService,
        { provide: getModelToken(Broker.name), useValue: brokerModel },
        HelperService,
        AggregateCommon,
      ],
    }).compile();

    service = module.get<BrokerService>(BrokerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBrokerType', () => {
    it('returns all broker types', async () => {
      const response = await service.getBrokerType();

      expect(response.result).toEqual(Object.values(BrokerTypeEnum));
    });
  });

  describe('getBroker', () => {
    it('returns the broker matching the slug for a logged-in user', async () => {
      const broker = { _id: BROKER_ID, slug: 'acme' };
      brokerModel.findOne.mockReturnValue(createFindOneResult(broker));

      const response = await service.getBroker('acme', true);

      expect(brokerModel.findOne).toHaveBeenCalledWith({
        slug: 'acme',
        is_deleted: false,
      });
      expect(response.result).toBe(broker);
    });

    it('only returns active brokers for a non-logged-in user', async () => {
      const broker = { _id: BROKER_ID, slug: 'acme' };
      brokerModel.findOne.mockReturnValue(createFindOneResult(broker));

      const response = await service.getBroker('acme', false);

      expect(brokerModel.findOne).toHaveBeenCalledWith({
        slug: 'acme',
        is_deleted: false,
        status: StatusEnum.ACTIVE,
      });
      expect(response.result).toBe(broker);
    });

    it('throws BROKER_NOT_FOUND when no broker matches', async () => {
      brokerModel.findOne.mockReturnValue(createFindOneResult(null));

      await expect(service.getBroker('missing', true)).rejects.toThrow();
    });
  });

  describe('getBrokers', () => {
    it('returns paginated results with pagination metadata', async () => {
      const brokers = [{ _id: '1' }, { _id: '2' }];
      brokerModel.aggregate.mockResolvedValue(brokers);
      brokerModel.countDocuments.mockResolvedValue(25);

      const response = await service.getBrokers({
        limit: 10,
        skip: 2,
        type: '' as never,
        search: '',
      });

      expect(response.result).toBe(brokers);
      expect(response.pagination).toEqual({
        current_page: 2,
        total_pages: 3,
        total: 25,
      });
    });

    it('filters by broker_type when provided', async () => {
      brokerModel.aggregate.mockResolvedValue([]);
      brokerModel.countDocuments.mockResolvedValue(0);

      await service.getBrokers({
        limit: 10,
        skip: 1,
        type: BrokerTypeEnum.CFD,
        search: '',
      });

      expect(brokerModel.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({ broker_type: BrokerTypeEnum.CFD }),
      );
    });
  });

  describe('createBroker', () => {
    const payload = { slug: 'new-broker' } as never;

    it('creates a broker when the slug is unique', async () => {
      brokerModel.findOne.mockResolvedValue(null);

      const response = await service.createBroker(payload, USER_ID);

      expect(brokerModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'new-broker',
          performance_metrics: expect.objectContaining({
            aum_growth: expect.any(Number),
            liquidity_access: expect.any(Number),
            client_retention: expect.any(Number),
          }),
        }),
      );
      expect(response.message).toBe('create broker success');
    });

    it('throws when the slug already exists', async () => {
      brokerModel.findOne.mockResolvedValue({ _id: 'existing', slug: 'new-broker' });

      await expect(service.createBroker(payload, USER_ID)).rejects.toThrow();
      expect(brokerModel.create).not.toHaveBeenCalled();
    });
  });

  describe('checkExitsSlug', () => {
    it('excludes the current broker id when checking for duplicates', async () => {
      brokerModel.findOne.mockResolvedValue(null);

      await service.checkExitsSlug('acme', BROKER_ID);

      expect(brokerModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'acme',
          is_deleted: false,
          _id: expect.objectContaining({ $ne: expect.anything() }),
        }),
      );
    });
  });

  describe('updateBroker', () => {
    const payload = { slug: 'updated-slug' } as never;

    it('throws BROKER_NOT_FOUND when the broker does not exist', async () => {
      brokerModel.findOne.mockReturnValueOnce(createFindOneResult(null));

      await expect(
        service.updateBroker(BROKER_ID, payload, USER_ID),
      ).rejects.toThrow();
      expect(brokerModel.updateOne).not.toHaveBeenCalled();
    });

    it('throws SLUG_ALREADY_EXISTS when another broker has the slug', async () => {
      brokerModel.findOne
        .mockReturnValueOnce(createFindOneResult({ _id: BROKER_ID, slug: 'old-slug' }))
        .mockResolvedValueOnce({ _id: 'other-broker', slug: 'updated-slug' });

      await expect(
        service.updateBroker(BROKER_ID, payload, USER_ID),
      ).rejects.toThrow();
      expect(brokerModel.updateOne).not.toHaveBeenCalled();
    });

    it('updates the broker when the slug is free', async () => {
      brokerModel.findOne
        .mockReturnValueOnce(createFindOneResult({ _id: BROKER_ID, slug: 'old-slug' }))
        .mockResolvedValueOnce(null);

      const response = await service.updateBroker(BROKER_ID, payload, USER_ID);

      expect(brokerModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ slug: 'updated-slug' }),
        }),
      );
      expect(response.message).toBe('update broker success');
    });
  });

  describe('updateStatus', () => {
    it('throws BROKER_NOT_FOUND when the broker does not exist', async () => {
      brokerModel.findOne.mockReturnValueOnce(createFindOneResult(null));

      await expect(
        service.updateStatus(
          BROKER_ID,
          { status: StatusEnum.INACTIVE },
          USER_ID,
        ),
      ).rejects.toThrow();
      expect(brokerModel.updateOne).not.toHaveBeenCalled();
    });

    it('updates the broker status', async () => {
      brokerModel.findOne.mockReturnValueOnce(
        createFindOneResult({ _id: BROKER_ID, slug: 'acme' }),
      );

      const response = await service.updateStatus(
        BROKER_ID,
        { status: StatusEnum.INACTIVE },
        USER_ID,
      );

      expect(brokerModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ status: StatusEnum.INACTIVE }),
        }),
      );
      expect(response.message).toBe('update broker status success');
    });
  });

  describe('deleteOrRestoreBroker', () => {
    it('soft-deletes the broker', async () => {
      brokerModel.findOne.mockReturnValueOnce(
        createFindOneResult({ _id: BROKER_ID, slug: 'acme' }),
      );

      const response = await service.deleteOrRestoreBroker(
        BROKER_ID,
        USER_ID,
        'delete',
      );

      expect(brokerModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ is_deleted: true }),
        }),
      );
      expect(response.message).toBe('delete broker success');
    });

    it('throws when restoring would create a duplicate slug', async () => {
      brokerModel.findOne
        .mockReturnValueOnce(createFindOneResult({ _id: BROKER_ID, slug: 'acme' }))
        .mockResolvedValueOnce({ _id: 'other-broker', slug: 'acme' });

      await expect(
        service.deleteOrRestoreBroker(BROKER_ID, USER_ID, 'restore'),
      ).rejects.toThrow();
      expect(brokerModel.updateOne).not.toHaveBeenCalled();
    });

    it('restores the broker when the slug is free', async () => {
      brokerModel.findOne
        .mockReturnValueOnce(createFindOneResult({ _id: BROKER_ID, slug: 'acme' }))
        .mockResolvedValueOnce(null);

      const response = await service.deleteOrRestoreBroker(
        BROKER_ID,
        USER_ID,
        'restore',
      );

      expect(brokerModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ is_deleted: false }),
        }),
      );
      expect(response.message).toBe('restore broker success');
    });
  });
});
